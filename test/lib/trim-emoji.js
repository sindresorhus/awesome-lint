import test from 'ava';
import trimEmoji from '../../lib/trim-emoji';

test('trimEmoji - trim before', t => {
	t.deepEqual(trimEmoji('⭐hello'), 'hello');
});
test('trimEmoji - trim before and space', t => {
	t.deepEqual(trimEmoji('⭐ hello'), 'hello');
});
test('trimEmoji - trim after', t => {
	t.deepEqual(trimEmoji('hello⭐'), 'hello');
});
test('trimEmoji - trim multiple', t => {
	t.deepEqual(trimEmoji('⭐⭐hello'), 'hello');
});
test('trimEmoji - trim multiple with spaces', t => {
	t.deepEqual(trimEmoji('⭐ ⭐hello'), 'hello');
});
test('trimEmoji - not trim if no emoji', t => {
	t.deepEqual(trimEmoji(' hello '), ' hello ');
});
test('trimEmoji - not trim if in the middle', t => {
	t.deepEqual(trimEmoji('hello⭐hello'), 'hello⭐hello');
});
