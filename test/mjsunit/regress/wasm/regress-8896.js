// Copyright 2019 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Flags: --experimental-wasm-eh --allow-natives-syntax
// Disable Liftoff so we can serialize the module.
// Flags: --no-liftoff

d8.file.execute("test/mjsunit/wasm/wasm-module-builder.js");

(function TestSerializeDeserializeRuntimeCall() {
  var builder = new WasmModuleBuilder();
  var except = builder.addTag(kSig_v_v);
  builder.addFunction("f", kSig_v_v)
      .addBody([
        kExprThrow, except,
      ]).exportFunc();
  var wire_bytes = builder.toBuffer();
  var module = new WebAssembly.Module(wire_bytes);
  var instance1 = new WebAssembly.Instance(module);
  var serialized = %SerializeWasmModule(module);
  module = %DeserializeWasmModule(serialized, wire_bytes);
  var instance2 = new WebAssembly.Instance(module);
  assertThrows(() => instance2.exports.f(), WebAssembly.RuntimeError);
})();
