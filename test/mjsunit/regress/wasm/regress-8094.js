// Copyright 2018 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Flags: --expose-wasm --experimental-wasm-eh

d8.file.execute("test/mjsunit/wasm/wasm-module-builder.js");

// Instantiate a throwing module.
var builder = new WasmModuleBuilder();
builder.addTag(kSig_v_v);
builder.addFunction("propel", kSig_v_v)
       .addBody([kExprThrow, 0])
       .exportFunc();
var instance = builder.instantiate();

// Catch the exception.
var exception;
try {
  instance.exports.propel();
} catch (e) {
  exception = e;
}

// Check that the exception is an instance of the correct error function and
// that no extraneous properties exist. Setting such properties could be
// observable by JavaScript and could break compatibility.
assertInstanceof(exception, WebAssembly.RuntimeError);
assertArrayEquals(["stack", "message"], Object.getOwnPropertyNames(exception));
