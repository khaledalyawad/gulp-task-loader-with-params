'use strict';
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var paramToBeSentToTasks
function isString(str) {
	return 'string' === typeof str;
}

function getExtensions() {
	return Object
		.keys(require.extensions);
}

function getDefaults() {
	return {
		dir: 'gulp-tasks',
		exts: getExtensions() || ['.js'] // fallback
	};
}

module.exports = function(options , params) {
	paramToBeSentToTasks = params

	if (isString(options)) {
		options = { dir: options };
	} else if (!options) {
		options = {};
	}

	var opts = _.defaults(options, getDefaults());

	function byExtension(fileName) {
		var extension = path.extname(fileName);
		return ~opts.exts.indexOf(extension);
	}

	function stripExtension(fileName) {
		var extension = path.extname(fileName);
		return path.basename(fileName, extension);
	}

	function loadTask(task) {
		var modulePath = path.join(process.cwd(), opts.dir, task);
		var taskName = stripExtension(task);

		gulp.task(taskName, [], require(modulePath)(paramToBeSentToTasks));
	}

	function resolvePath(dir) {
		return path.join(opts.dir, dir);
	}

	function loadTasks(currentPath) {
		var file = path.basename(currentPath);
		var stats = fs.lstatSync(currentPath);

		if (stats.isFile() && byExtension(file)) {
			loadTask(file);
		}

		if (stats.isDirectory()) {
			fs.readdirSync(currentPath)
				.filter(byExtension)
				.forEach(loadTask.bind(file));
		}
	}

	fs.readdirSync(opts.dir)
		.map(resolvePath)
		.forEach(loadTasks);
};
