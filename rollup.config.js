import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const input = path.join(__dirname, './src/index.ts');
const ts = typescript({
  // tsconfig: false,
  // experimentalDecorators: true,
  module: 'es2015',
});
const plugins = [ts, resolve(), commonjs()];

const esm = {
  input,
  output: {
    file: pkg.module,
    format: 'esm',
  },
  plugins,
};

const ssr = {
  input,
  output: {
    file: pkg.main,
    format: 'cjs',
  },
  plugins,
};

function generateConfig(config, withTerser = true) {
  const minConfig = {
    ...config,
  };
  minConfig.output = {
    ...config.output,
    file: withTerser ? config.output.file.replace(/\.js$/i, '.min.js') : config.output.file,
    sourcemap: withTerser,
  };
  minConfig.plugins = [...config.plugins, ...(withTerser ? [terser()] : [])];
  return [config, minConfig];
}

export default [...generateConfig(esm), ...generateConfig(ssr)];
