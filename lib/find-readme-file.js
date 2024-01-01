import fs from 'node:fs';
import path from 'node:path';

export default function findReadmeFile(directory) {
	const readmeFile = fs.readdirSync(directory).find(filename => (
		/^(readme|readme\.md|readme\.markdown|readme.txt)$/i.test(filename)
	));

	if (readmeFile) {
		return path.join(fs.realpathSync(directory), readmeFile);
	}
}
