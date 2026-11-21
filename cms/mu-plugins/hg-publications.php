<?php
/**
 * Plugin Name: HydroGeo publications
 * Description: Тип записей «Публикации» для страницы /competencies. Порядок — числом в поле «Порядок» (menu_order).
 *
 * Ставится в wp-content/mu-plugins/ на cms.hydrogeo.kz. Angular читает
 * ?rest_route=/wp/v2/publications (см. src/app/core/publications.service.ts).
 */

const HG_PUB_TYPE = 'hg_publication';
const HG_PUB_FIELDS = array(
	'hg_doi'     => 'Ссылка на DOI / статью',
	'hg_scopus_q'   => 'Scopus: квартиль (Q1–Q4)',
	'hg_percentile' => 'Scopus: Percentile (число)',
	'hg_citescore'  => 'Scopus: Cite Score (число)',
	'hg_wos_if'     => 'WOS Impact Factor (число)',
	'hg_note_ru' => 'Примечание (русский)',
	'hg_note_kk' => 'Примечание (қазақша)',
	'hg_note_en' => 'Примечание (English)',
);

add_action( 'init', function () {
	register_post_type( HG_PUB_TYPE, array(
		'labels'       => array(
			'name'          => 'Публикации',
			'singular_name' => 'Публикация',
			'add_new'       => 'Добавить публикацию',
			'add_new_item'  => 'Новая публикация',
			'edit_item'     => 'Редактировать публикацию',
			'all_items'     => 'Все публикации',
		),
		'public'       => true,
		'show_ui'      => true,
		'show_in_rest' => true,
		'rest_base'    => 'publications',
		'menu_icon'    => 'dashicons-book-alt',
		'menu_position' => 5,
		'has_archive'  => false,
		'supports'     => array( 'title', 'editor', 'page-attributes', 'custom-fields' ),
	) );

	foreach ( array_keys( HG_PUB_FIELDS ) as $key ) {
		register_post_meta( HG_PUB_TYPE, $key, array(
			'type'              => 'string',
			'single'            => true,
			'show_in_rest'      => true,
			'sanitize_callback' => 'sanitize_text_field',
		) );
	}
} );

// Классический редактор: жирный шрифт для фамилий проще, чем в Gutenberg.
add_filter( 'use_block_editor_for_post_type', function ( $use, $type ) {
	return HG_PUB_TYPE === $type ? false : $use;
}, 10, 2 );

// 'custom-fields' нужен только чтобы метаполя попадали в REST; стандартный блок «Произвольные поля» редактору ни к чему.
add_action( 'add_meta_boxes', function () {
	remove_meta_box( 'postcustom', HG_PUB_TYPE, 'normal' );
}, 20 );

// Окно описания вдвое ниже обычного: текста там немного. Режим «растягивания» редактора отключаем,
// иначе WP сам раздувает окно до 300px.
add_filter( 'wp_editor_expand', function ( $expand, $type ) {
	return HG_PUB_TYPE === $type ? false : $expand;
}, 10, 2 );
add_filter( 'wp_editor_settings', function ( $settings, $editor_id ) {
	$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
	if ( 'content' === $editor_id && $screen && HG_PUB_TYPE === $screen->post_type ) {
		$settings['editor_height'] = 150;
		$settings['media_buttons'] = false; // картинки и файлы в описании публикации не нужны
		$settings['tinymce']       = array_merge( is_array( $settings['tinymce'] ?? null ) ? $settings['tinymce'] : array(), array(
			'wp_autoresize_on'      => false,
			'autoresize_min_height' => 150,
		) );
	}
	return $settings;
}, 10, 2 );

// «Порядок» живёт в нашем блоке, стандартные «Свойства записи» (page-attributes нужен только для REST) прячем.
add_action( 'add_meta_boxes', function () {
	remove_meta_box( 'pageparentdiv', HG_PUB_TYPE, 'side' );
}, 20 );

// Одна колонка независимо от «Настроек экрана»: «Статус публикации» — полоса из одной строки под описанием.
add_filter( 'get_user_option_screen_layout_' . HG_PUB_TYPE, function () {
	return 1;
} );

// В «Статусе публикации» остаются «Статус / Видимость / Опубликовать сразу», а кнопка «Опубликовать» (и «В корзину») уезжает вниз формы — см. скрипт ниже.
add_action( 'add_meta_boxes', function () {
	remove_meta_box( 'submitdiv', HG_PUB_TYPE, 'side' );
	add_meta_box( 'submitdiv', 'Статус публикации', 'post_submit_meta_box', HG_PUB_TYPE, 'side', 'high' );
}, 20 );

add_filter( 'enter_title_here', function ( $text, $post ) {
	return HG_PUB_TYPE === $post->post_type ? 'Можно не заполнять — заполнится автоматически из описания' : $text;
}, 10, 2 );

// Курсор сразу в окно описания (в визуальный режим TinyMCE), а не в заголовок.
add_action( 'admin_footer', function () {
	$screen = get_current_screen();
	if ( ! $screen || HG_PUB_TYPE !== $screen->post_type || 'post' !== $screen->base ) {
		return;
	}
	?>
	<style>
		/* Заголовок вплотную к описанию: пустая строка постоянной ссылки (тип публичный, но ссылка не нужна) и отступы убраны. */
		#titlediv { margin-bottom: 0; }
		#titlediv .inside, #edit-slug-box { display: none; }
		#post-body-content { margin-bottom: 8px; }
		#wp-content-editor-tools { padding-top: 0; }
		#wp-content-wrap .wp-editor-tabs { float: right; }
		/* «Статус / Видимость / Опубликовать сразу» — в одну строку. */
		#submitdiv #misc-publishing-actions { display: flex; flex-wrap: wrap; gap: 4px 28px; padding: 6px 12px; }
		#submitdiv .misc-pub-section { border: 0; padding: 6px 0; }
		#submitdiv #minor-publishing-actions { padding: 10px 12px 0; }
		/* Публичной страницы у публикации нет — «Посмотреть» не нужен. */
		#preview-action { display: none; }
		#hg-bottom-actions #major-publishing-actions { border-top: 0; background: transparent; padding: 0; }
		#hg-bottom-actions #delete-action { float: left; line-height: 2.5; }
		#hg-bottom-actions #publishing-action { float: right; }
	</style>
	<script>
	jQuery(function ($) {
		// Переносим сам элемент (не копию), чтобы обработчики WP на кнопке остались рабочими.
		var actions = $('#major-publishing-actions');
		if (actions.length) {
			$('<div id="hg-bottom-actions" style="overflow:hidden;margin:20px 0 0"></div>')
				.insertAfter('#hg_pub_fields')
				.append(actions);
		}
		var tries = 0;
		(function focusEditor() {
			var ed = window.tinymce && tinymce.get('content');
			if (ed && ed.initialized && !ed.isHidden()) {
				ed.focus();
			} else if (tries++ < 30) {
				setTimeout(focusEditor, 100);
			}
		})();
	});
	</script>
	<?php
} );

function hg_pub_field( $post, $key, $label, $width = '100%' ) {
	printf(
		'<p style="margin:0 0 12px"><label for="%1$s"><strong>%2$s</strong></label><br>'
		. '<input type="text" id="%1$s" name="%1$s" value="%3$s" style="width:%4$s"></p>',
		esc_attr( $key ),
		esc_html( $label ),
		esc_attr( get_post_meta( $post->ID, $key, true ) ),
		esc_attr( $width )
	);
}

function hg_pub_textarea( $post, $key, $label ) {
	printf(
		'<p style="margin:0 0 12px"><label for="%1$s"><strong>%2$s</strong></label><br>'
		. '<textarea id="%1$s" name="%1$s" rows="3" style="width:100%%">%3$s</textarea></p>',
		esc_attr( $key ),
		esc_html( $label ),
		esc_textarea( get_post_meta( $post->ID, $key, true ) )
	);
}

add_action( 'add_meta_boxes', function () {
	add_meta_box( 'hg_pub_fields', 'Данные публикации', function ( $post ) {
		global $wpdb;
		wp_nonce_field( 'hg_pub_save', 'hg_pub_nonce' );

		// У новой публикации предлагаем следующий номер — она встанет в конец таблицы.
		$order = (int) $post->menu_order;
		if ( 'auto-draft' === $post->post_status ) {
			$order = 1 + (int) $wpdb->get_var( $wpdb->prepare(
				"SELECT MAX(menu_order) FROM {$wpdb->posts} WHERE post_type = %s AND post_status <> 'trash'", HG_PUB_TYPE
			) );
		}

		// Порядок и рейтинги — короткие числа, держим их одной строкой.
		echo '<div style="display:flex;flex-wrap:wrap;gap:16px;margin-bottom:4px">';
		printf(
			'<p style="margin:0 0 12px"><label for="hg_order"><strong>Порядок</strong></label><br>'
			. '<input type="number" min="0" id="hg_order" name="hg_order" value="%d" style="width:80px"></p>',
			$order
		);
		$cur = get_post_meta( $post->ID, 'hg_scopus_q', true );
		echo '<p style="margin:0 0 12px"><label for="hg_scopus_q"><strong>Scopus: квартиль</strong></label><br>'
			. '<select id="hg_scopus_q" name="hg_scopus_q" style="width:110px">';
		foreach ( array( '' => '— нет —', 'Q1' => 'Q1', 'Q2' => 'Q2', 'Q3' => 'Q3', 'Q4' => 'Q4' ) as $v => $t ) {
			printf( '<option value="%s"%s>%s</option>', esc_attr( $v ), selected( $cur, $v, false ), esc_html( $t ) );
		}
		echo '</select></p>';
		hg_pub_field( $post, 'hg_percentile', 'Scopus: Percentile', '110px' );
		hg_pub_field( $post, 'hg_citescore', 'Scopus: Cite Score', '110px' );
		hg_pub_field( $post, 'hg_wos_if', 'WOS Impact Factor', '110px' );
		echo '</div>';

		hg_pub_field( $post, 'hg_doi', 'Ссылка на DOI / статью' );
		echo '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">';
		hg_pub_textarea( $post, 'hg_note_ru', 'Примечание (русский)' );
		hg_pub_textarea( $post, 'hg_note_kk', 'Примечание (қазақша)' );
		hg_pub_textarea( $post, 'hg_note_en', 'Примечание (English)' );
		echo '</div>';

		echo '<hr><p><em>Описание (авторы, название, журнал) пишется в окне выше; фамилии сотрудников выделяйте кнопкой <b>Ж</b>. '
			. 'Заголовок можно не заполнять — он возьмётся из начала описания и виден только в админке.</em></p>';
		echo '<p><em>Порядок: меньше число — выше в таблице на сайте. Рейтинги необязательны: заполняйте только те, что есть, '
			. 'на сайте они выведутся с новой строки в скобках, например «(Quartiles: Scopus Q1, Percentile: 63, '
			. 'Cite Score: 4.9, WOS Impact Factor: 2.9)». Дробные числа пишите через точку.</em></p>';
	}, HG_PUB_TYPE, 'normal', 'high' );
} );

function hg_pub_request_ok() {
	return isset( $_POST['hg_pub_nonce'] ) && wp_verify_nonce( $_POST['hg_pub_nonce'], 'hg_pub_save' );
}

// Порядок из нашего поля — в menu_order; пустой заголовок — из начала описания.
add_filter( 'wp_insert_post_data', function ( $data ) {
	if ( HG_PUB_TYPE !== $data['post_type'] || ! hg_pub_request_ok() ) {
		return $data;
	}
	if ( isset( $_POST['hg_order'] ) ) {
		$data['menu_order'] = max( 0, (int) $_POST['hg_order'] );
	}
	$untitled = '' === trim( $data['post_title'] ) || 'Auto Draft' === $data['post_title'];
	if ( $untitled && 'auto-draft' !== $data['post_status'] ) {
		$data['post_title'] = mb_substr( trim( wp_strip_all_tags( $data['post_content'] ) ), 0, 80 );
	}
	return $data;
} );

add_action( 'save_post_' . HG_PUB_TYPE, function ( $post_id ) {
	if ( ! hg_pub_request_ok() ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}
	foreach ( array_keys( HG_PUB_FIELDS ) as $key ) {
		if ( isset( $_POST[ $key ] ) ) {
			update_post_meta( $post_id, $key, sanitize_text_field( wp_unslash( $_POST[ $key ] ) ) );
		}
	}
} );

// Колонка «Порядок» в списке, чтобы видеть нумерацию, не открывая записи.
add_filter( 'manage_' . HG_PUB_TYPE . '_posts_columns', function ( $cols ) {
	$cols['hg_order'] = 'Порядок';
	return $cols;
} );
add_action( 'manage_' . HG_PUB_TYPE . '_posts_custom_column', function ( $col, $post_id ) {
	if ( 'hg_order' === $col ) {
		echo (int) get_post_field( 'menu_order', $post_id );
	}
}, 10, 2 );
add_action( 'pre_get_posts', function ( $q ) {
	if ( is_admin() && $q->is_main_query() && HG_PUB_TYPE === $q->get( 'post_type' ) && ! $q->get( 'orderby' ) ) {
		$q->set( 'orderby', 'menu_order' );
		$q->set( 'order', 'ASC' );
	}
} );
