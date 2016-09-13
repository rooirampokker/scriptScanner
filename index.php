<?php
/*******************************************************************************
* The Original Code is: scriptScanner v1.2
* The Initial Developer of the Original Code is Leslie Albrecht & Jaco Uys
* All Rights Reserved.
* 20-02-2007
******************************************************************************/
/******************************************************************************
*
*
*
******************************************************************************/
include_once("classes/cls_fast_template.php");
$tpl = new FastTemplate("./");
$tpl->no_strict();
$templates = array('main'          => "templates/main.tpl",
                   'searchForm'    => "templates/searchForm.tpl");

$tpl->define($templates);
/******************************************************************************
*
* The following section creates the explorer-like browsable directory structure
*
******************************************************************************/
$directories = array();
if (isset($_REQUEST['dir']) &&
    strlen($_REQUEST['dir'])) {
	$dir = $parent_dir = realpath($_REQUEST['dir']);
} else {
	$dir = get_parent_dir(getcwd());
}
$parent_dir = get_parent_dir($dir);
//creates the parent directory link....
$current_directory = "<table width='100%'>
						<tr>
							<td><img src='images/dirup.gif' ><a href='$_SERVER[PHP_SELF]?dir=$parent_dir'>Parent Directory</a></td>
							<td>&nbsp;</td>
						</tr>
						<tr>
							<td>";
//loads a list of sub-directories into an array...
if ($handle = opendir($dir)) {
    while (false !== ($file = readdir($handle))) {
        $slash = getSlash($dir);
    	$full_path = "$dir{$slash}$file";
    	if (is_dir($full_path) && $file != "." && $file != "..")
   	 {
    		$directories[] = array ("full_path" => $full_path,
                                    "dir_name"  => $file);
    	}
    }
    closedir($handle);
}
$current_directory = show_sub_dirs($directories, $current_directory);
$tpl->assign (array('ACTION' => $_SERVER['PHP_SELF'],
                    'ACTIVEDIR' => $dir,
                    'SUBDIRS' => $current_directory));
$tpl->parse ('BODY', 'searchForm');
$tpl->parse ('MAIN', 'main');
$tpl->FastPrint();
/******************************************************************************/
//creates the browsable sub-directory links...

function show_sub_dirs($directories, $current_directory) {
    $rows = 0;
    $count = count ($directories);
    $halfway = ceil($count/2);
    foreach ($directories as $dirs) {
    	++$rows;
    	$current_directory .= "<img src='images/dir.gif' ><a href='$_SERVER[PHP_SELF]?dir={$dirs['full_path']}' >{$dirs['dir_name']}</a>";
    	if ($rows == $halfway) {
    		$current_directory .= "</td><td>";
    	} else if ($rows != $count) {
    		$current_directory .= "<br />";
    	}
    }
    return $current_directory .= '</td></tr></table>';
}
/******************************************************************************/

/******************************************************************************/
function get_parent_dir ($dir) {
    $slash = getSlash($dir);
	if (strrchr($dir, $slash)) {
        $parent = str_replace(strrchr($dir, $slash), '', $dir);
    } else {
        $parent = $dir;
    }
	return realpath($parent);
}
/******************************************************************************/
function getSlash($dir) {
$have_backslash = strpos($dir, "\\");
if ($have_backslash) {
    $slash = '\\';
} else {
    $slash = "/";
}
return $slash;
}
/*******************************************************************************
                 This section performs the actual search
*******************************************************************************/
if (isset($_POST['submit'])) {
    set_time_limit($_REQUEST['timeLimit']);
    $counter = 0;
    $y=100;
    $searchDir = $dir.'/'; //$searchPath;
    runScanner($searchDir);
}
/*******               --------------------------                     *********/
function runScanner ($searchPath) {
      $searchDir = scriptScanner($_POST['searchName'], $searchPath);
      if ($searchDir) {
         foreach ($searchDir as $dir) {
            runScanner ($searchPath.$dir."/");
         }
      }
}
/*********************************************/

    function scriptScanner ($searchName='0', $searchDir = '', $dirCounter=0, $fileCounter=0, $hitCounter=0) {
            $x=0;
            $directory = '';
            if (strlen($searchName)) {
                $activeDir = opendir($searchDir);
                if (isset($_REQUEST['verbose'])) {
                    print("<br>Scanning directory: <b>$searchDir</b>");
                }
                while (false !== ($scanner = readdir($activeDir))) {
                    if (is_file($searchDir."/".$scanner)) {//get files
                        $fileCounter++;
                        $fileContent = file_get_contents($searchDir.$scanner);
                        if (isset($_REQUEST['case']))
                            $found = strpos($fileContent, "$searchName");
                        else
                            $found = stripos($fileContent, "$searchName");
                        if (isset($_REQUEST['verbose'])) {
                            print("<br>Searching file: <b>$searchDir.$scanner</b>...");
                        }
                        if ($found !== FALSE) {
                          $hitCounter++;
                          if (isset($_REQUEST['doReplace'])) {
                            if (isset($_REQUEST['case'])) {
                                $replaced = str_replace($searchName, $_REQUEST['replaceName'], $fileContent);
                            } else {
                                $replaced = str_ireplace($searchName, $_REQUEST['replaceName'], $fileContent);
                            }
                            file_put_contents($searchDir.$scanner, $replaced);
                            $searchName = htmlspecialchars($searchName);
                            print("<br>The string: <b>$searchName</b> was replaced with <b>$_REQUEST[replaceName]</b> in <b>$searchDir{$scanner}</b>");
                          } else {
                            $searchName = htmlspecialchars($searchName);
                            print("<br>The string: <b> $searchName </b> was found in <b>$searchDir{$scanner}</b>");
                          }

                        } else  {

                        }
                    } else if ($scanner != '.' && $scanner != '..'){ //get sub-directories
                        $dirCounter++;
                        $directory[$x++] = $scanner;
                        }
                }
                if (isset($_REQUEST['verbose'])) {
                    print("<br>$fileCounter files checked<br>$dirCounter sub directories logged<br>$hitCounter file/s contain search string<br>");
                }
                if (count($directory) >= 1) {
                    return $directory;
                } else return 0;
            } else return 0;
     }
?>
