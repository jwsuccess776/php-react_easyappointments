<!DOCTYPE html>
<html>
<head>
    <title>Get Plano - Installation</title>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <link rel="icon" type="image/x-icon" href="<?= asset_url('assets/img/favicon.ico') ?>">
</head>
<body style="margin: 0; margin-top: 5%; background: #dddddd;">

    <div id="app"></div>

    <script>
        var GlobalVariables = {
            'csrfToken': <?= json_encode($this->security->get_csrf_hash()) ?>,
            'baseUrl': <?= json_encode(config('base_url')) ?>
        };

        var EALang = <?= json_encode($this->lang->language) ?>;
    </script>
    <script type="text/javascript" src="<?= asset_url('assets/js/installation.bundle.js') ?>"></script>

</body>
</html>
