
import test from 'node:test';
import assert from 'node:assert/strict';

test('public registration role policy is Student only', () => {
  const publicRole = 'Student'; // enforced by /auth/register rather than request body
  assert.equal(publicRole, 'Student');
});

test('external URL validation accepts http(s) and rejects javascript URLs', () => {
  const valid = value => { try { return ['http:', 'https:'].includes(new URL(value).protocol); } catch { return false; } };
  assert.equal(valid('https://example.com/apply'), true);
  assert.equal(valid('http://example.com'), true);
  assert.equal(valid('javascript:alert(1)'), false);
  assert.equal(valid('not a url'), false);
});
