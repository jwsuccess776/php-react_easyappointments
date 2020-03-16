<div id="footer">
    <div id="footer-content" class="col-xs-12 col-sm-8">
        Powered by
        <a href="http://getplano.com">Plano
            <?php
                echo 'v' . $this->config->item('version');

                $release_title = $this->config->item('release_label');
                if ($release_title != '') {
                    echo ' - ' . $release_title;
                }
            ?></a>
<!--        |-->
<!--        <span id="select-language" class="label label-success">-->
<!--        	-- ucfirst($this->config->item('language')) ?>
<!--        </span>-->
        |
        <a href="<?= site_url('appointments') ?>">
            <?= lang('go_to_booking_page') ?>
        </a>
    </div>
</div>

<script src="<?= asset_url('assets/js/backend.js') ?>"></script>
<script src="<?= asset_url('assets/js/general_functions.js') ?>"></script>
<script src="<?= asset_url('assets/js/backend.bundle.js') ?>"></script>
</body>
</html>
