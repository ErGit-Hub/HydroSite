<?php
/**
 * Разовый перенос старого поля hg_tail («(Quartiles: Scopus Q1, Percentile: 63, ...)»)
 * в отдельные поля рейтингов: wp eval-file wp-content/migrate-rating.php
 * Записи, где разобрать не удалось, выводятся — их заполнить вручную.
 */
$posts = get_posts( array( 'post_type' => 'hg_publication', 'post_status' => 'any', 'numberposts' => -1 ) );
foreach ( $posts as $p ) {
	$tail = trim( (string) get_post_meta( $p->ID, 'hg_tail', true ) );
	if ( '' === $tail ) {
		continue;
	}
	$num = '(\d+(?:[.,]\d+)?)';
	$found = array(
		'hg_scopus_q'   => preg_match( '/Scopus\s+(Q[1-4])/i', $tail, $m ) ? strtoupper( $m[1] ) : '',
		'hg_percentile' => preg_match( '/Percentile:\s*' . $num . '/i', $tail, $m ) ? str_replace( ',', '.', $m[1] ) : '',
		'hg_citescore'  => preg_match( '/Cite\s*Score:\s*' . $num . '/i', $tail, $m ) ? str_replace( ',', '.', $m[1] ) : '',
		'hg_wos_if'     => preg_match( '/Impact\s*Factor:\s*' . $num . '/i', $tail, $m ) ? str_replace( ',', '.', $m[1] ) : '',
	);
	if ( ! array_filter( $found ) ) {
		echo "НЕ РАЗОБРАНО #{$p->ID}: {$tail}\n";
		continue;
	}
	foreach ( $found as $k => $v ) {
		update_post_meta( $p->ID, $k, $v );
	}
	delete_post_meta( $p->ID, 'hg_tail' );
	echo "ok #{$p->ID}: " . implode( ' | ', $found ) . "\n";
}
