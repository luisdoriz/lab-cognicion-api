const CREATE = import('./create');
const READ = import('./read');

module.exports = {
    ...CREATE,
    ...READ,
};
