import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matchingStep, encryptSecret, decryptSecret, newSecret, newRecoveryCodes } from '../src/lib/totp.ts';
test('RFC 6238 SHA1, seis dígitos e rejeição de replay',()=>{assert.equal(matchingStep('GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ','287082',-1,59000),1);assert.equal(matchingStep('GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ','287082',1,59000),null);});
test('criptografia vinculada à conta',()=>{process.env.TOTP_ENCRYPTION_KEY='ab'.repeat(32);const secret=newSecret();const encrypted=encryptSecret(secret,'a');assert.equal(decryptSecret(encrypted,'a'),secret);assert.throws(()=>decryptSecret(encrypted,'b'));assert.equal(new Set(newRecoveryCodes()).size,10);});
