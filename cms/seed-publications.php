<?php
/**
 * Разовая заливка текущих публикаций в WP: wp eval-file seed-publications.php
 * Повторный запуск безопасен — уже залитые (по hg_seed) пропускаются.
 */

$file = __DIR__ . '/publications-seed.json';
$items = json_decode( file_get_contents( $file ), true );
foreach ( $items as $it ) {
	$exists = get_posts( array(
		'post_type' => 'hg_publication', 'post_status' => 'any', 'numberposts' => 1,
		'meta_key' => 'hg_seed', 'meta_value' => $it['seed'], 'fields' => 'ids',
	) );
	if ( $exists ) {
		continue;
	}
	$id = wp_insert_post( array(
		'post_type'    => 'hg_publication',
		'post_status'  => 'publish',
		'post_title'   => mb_substr( trim( wp_strip_all_tags( $it['html'] ) ), 0, 80 ),
		'post_content' => $it['html'],
		'menu_order'   => $it['order'],
	) );
	update_post_meta( $id, 'hg_seed', $it['seed'] );
	update_post_meta( $id, 'hg_doi', $it['doi'] );
	update_post_meta( $id, 'hg_tail', $it['tail'] );
	update_post_meta( $id, 'hg_note_ru', $it['ru'] );
	update_post_meta( $id, 'hg_note_en', $it['en'] );
	echo "added {$it['seed']}\n";
}
