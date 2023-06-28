const { withDangerousMod, withPlugins } = require('@expo/config-plugins');
const { mergeContents } = require('@expo/config-plugins/build/utils/generateCode');

const fs = require('fs-extra');
const path = require('path');

async function readFileAsync(path) {
	return fs.promises.readFile(path, 'utf-8');
}
async function saveFileAsync(path, content) {
	return fs.promises.writeFile(path, content, 'utf-8');
}

const withSimdjson = (c) => {
	return withDangerousMod(c, [
		'ios',
		async (config) => {
			const podfile = path.join(config.modRequest.platformProjectRoot, 'Podfile');
			const contents = await readFileAsync(podfile);
			await saveFileAsync(podfile, addSimdjson(contents));
			return config;
		},
	]);
};

function addSimdjson(src) {
	return mergeContents({
		tag: `@nozbe/watermelondb`,
		src,
		newSrc: `pod 'simdjson', path: '../node_modules/@nozbe/simdjson', modular_headers: true`,
		offset: 0,
		comment: '#',
		anchor: /target 'watermelonapp' do/, // MODIFY THIS LINE AS NEEDED IF YOU HAVE A DIFFERENT APP NAME
	}).contents;
}

module.exports = (config) => withPlugins(config, [withSimdjson]);
