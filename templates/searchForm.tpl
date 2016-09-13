<html>
<head>
    <title>String Search function</title>
    <script language="javascript" src="javascript/scriptaculous/scriptaculous.js"></script>
    <script language="javascript" src="javascript/scriptaculous/prototype.js"></script>
    <script language="javascript" src="javascript/common.js"></script>
</head>

<body onLoad="toggler()">
    <table border="1">
        <form action="index.php" method="POST" name="scannerform">
            <tr>
                <td colspan="4" align="center">Active directory is: <b>{ACTIVEDIR}</b></td>
            </tr>
            <tr>
                <td colspan="4">{SUBDIRS}&nbsp;</td>
            </tr>
            <tr>
                <td colspan="2">Enter search string:</td>
                <td align="center"><input type="text" name="searchName"></td>
                <td align="center">Replace?<input type="checkbox" name="doReplace" id="doReplace" onChange="toggler()"></td>
            </tr>
            <tr id='replaceRow'>
                <td colspan="2">
                	Enter replace string:
                </td>
                <td align="center">
                	<input type="text" name="replaceName">
                </td>
                <td>&nbsp; </td>
            </tr>
            <tr>
                <td align="center">Case sensitive: <input type="checkbox" name="case"></td>
                <td align="center">Verbose reply: <input type="checkbox" name="verbose"></td>
                <td align="center" colspan="3">Time limit: <input type="text" name="timeLimit" size="3" maxlength="3" value="240"> seconds</td>
            </tr>
            <tr>
                <td colspan="4" align="center">
                	<input type='hidden' name='dir' value='{ACTIVEDIR}' />
                	<input type="submit" name="submit" value="submit">
                </td>
            </tr>
        </form>
    </table>
</body>

</html>
