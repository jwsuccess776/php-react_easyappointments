<!DOCTYPE html>
<html lang="en">
<head>
    <title><?= $company_name ?> | Plano</title>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

    <link rel="icon" type="image/x-icon" href="<?= asset_url('assets/img/favicon.ico') ?>">

    <link rel="stylesheet" type="text/css" href="<?= asset_url('assets/ext/bootstrap/css/bootstrap.min.css') ?>">
    <link rel="stylesheet" type="text/css" href="<?= asset_url('assets/ext/jquery-ui/jquery-ui.min.css') ?>">
    <link rel="stylesheet" type="text/css" href="<?= asset_url('assets/ext/jquery-qtip/jquery.qtip.min.css') ?>">
    <link rel="stylesheet" type="text/css" href="<?= asset_url('assets/ext/trumbowyg/ui/trumbowyg.min.css') ?>">
    <link rel="stylesheet" type="text/css" href="<?= asset_url('assets/css/backend.css') ?>">
    <link rel="stylesheet" type="text/css" href="<?= asset_url('assets/css/general.css') ?>">

    <script src="<?= asset_url('assets/ext/jquery/jquery.min.js') ?>"></script>
    <script src="<?= asset_url('assets/ext/bootstrap/js/bootstrap.min.js') ?>"></script>
    <script src="<?= asset_url('assets/ext/jquery-ui/jquery-ui.min.js') ?>"></script>
    <script src="<?= asset_url('assets/ext/jquery-qtip/jquery.qtip.min.js') ?>"></script>
    <script src="<?= asset_url('assets/ext/datejs/date.js') ?>"></script>
    <script src="<?= asset_url('assets/ext/jquery-mousewheel/jquery.mousewheel.js') ?>"></script>
    <script src="<?= asset_url('assets/ext/trumbowyg/trumbowyg.min.js') ?>"></script>

    <script>
    	// Global JavaScript Variables - Used in all backend pages.
    	var availableLanguages = <?= json_encode($this->config->item('available_languages')) ?>;
    	var EALang = <?= json_encode($this->lang->language) ?>;
        var EANavLinks = <?= json_encode([
            'whitelabel' => $company_name,
            'links' => [
                'calendar' => [
                    'hidden' => $privileges[PRIV_APPOINTMENTS]['view'] == false,
                    'active' => ($active_menu == PRIV_APPOINTMENTS),
                    'href' => site_url('backend'),
                    'label' => lang('calendar'),
                ],
                'customers' => [
                    'hidden' => $privileges[PRIV_CUSTOMERS]['view'] == false,
                    'active' => ($active_menu == PRIV_CUSTOMERS),
                    'href' => site_url('backend/customers'),
                    'label' => lang('customers'),
                ],
                'services' => [
                    'hidden' => $privileges[PRIV_SERVICES]['view'] == false,
                    'active' => ($active_menu == PRIV_SERVICES),
                    'href' => site_url('backend/services'),
                    'label' => lang('services'),
                ],
                'users' => [
                    'hidden' => $privileges[PRIV_USERS]['view'] == false,
                    'active' => ($active_menu == PRIV_USERS),
                    'href' => site_url('backend/users'),
                    'label' => lang('users'),
                ],
                'settings' => [
                    'hidden' => ($privileges[PRIV_SYSTEM_SETTINGS]['view'] == false
                        || $privileges[PRIV_USER_SETTINGS]['view'] == false),
                    'active' => ($active_menu == PRIV_SYSTEM_SETTINGS),
                    'href' => site_url('backend/settings'),
                    'label' => lang('settings'),
                ],
                'log_out' => [
                    'href' => site_url('user/logout'),
                    'label' => lang('log_out'),
                ],
            ],
        ]); ?>
    </script>
</head>

<body>

<div id="header-v2"></div>

<div id="notification" style="display: none;"></div>

<div id="loading" style="display: none;">
    <div class="any-element animation is-loading">
        &nbsp;
    </div>
</div>
