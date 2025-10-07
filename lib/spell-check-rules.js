const spellCheckRules = [
	{
		test: /\bnode\.?js\b/gi, // Special: optional dot
		value: 'Node.js',
	},
	{
		test: 'javascript',
		value: 'JavaScript',
	},
	{
		test: 'typescript',
		value: 'TypeScript',
	},
	{
		test: /\bpython\b(?=\s+(?:programming|language|code|script|development|data|analysis|syntax|framework|library|pip|django|flask))/gi,
		value: 'Python',
	},
	{
		test: /\bc\+\+\b/gi, // Special: plus signs
		value: 'C++',
	},
	{
		test: /\bc#\b/gi, // Special: hash
		value: 'C#',
	},
	{
		test: 'php',
		value: 'PHP',
	},
	{
		test: /\bruby\b(?=\s+(?:programming|language|code|on\s+rails|gem|development|script|syntax|framework))/gi,
		value: 'Ruby',
	},
	{
		test: /\brust\b(?=\s+(?:programming|language|code|development|syntax|framework|compiler|cargo|crate))/gi,
		value: 'Rust',
	},
	{
		test: /\bswift\b(?=\s+(?:programming|language|code|ios|apple|development|compiler|syntax|framework))/gi,
		value: 'Swift',
	},
	{
		test: 'kotlin',
		value: 'Kotlin',
	},
	{
		test: 'scala',
		value: 'Scala',
	},
	{
		test: 'clojure',
		value: 'Clojure',
	},
	{
		test: 'haskell',
		value: 'Haskell',
	},
	{
		test: /\bjulia\b(?=\s+(?:programming|language|code|development|syntax|package|computing|dataframes|plots|ecosystem))/gi,
		value: 'Julia',
	},
	{
		test: 'perl',
		value: 'Perl',
	},
	{
		test: /\bdart\b(?=\s+(?:programming|language|code|development|flutter|syntax|framework|pub|package))/gi,
		value: 'Dart',
	},
	{
		test: 'zig',
		value: 'Zig',
	},
	{
		test: /\bcrystal\b(?=\s+(?:programming|language|code|development|syntax|framework))/gi,
		value: 'Crystal',
	},

	{
		test: [/\bvue\.?js\b/gi, 'vuejs'],
		value: 'Vue.js',
	},
	{
		test: /\breact\b(?=\s+(?:component|hook|native|router|app|library|framework|context|state|props|jsx|dom|fiber|query|redux|testing))/gi,
		value: 'React',
	},
	{
		test: /\bangular\b(?=\s+(?:framework|component|directive|service|module|cli|material|router|forms|http|app|pipe|decorator))/gi,
		value: 'Angular',
	},
	{
		test: [/\bnext\.?js\b/gi, 'nextjs'],
		value: 'Next.js',
	},
	{
		test: [/\bnuxt\.?js\b/gi, 'nuxtjs'],
		value: 'Nuxt.js',
	},
	{
		test: /\bsvelte\b(?=\s+(?:component|kit|store|reactive|framework|app|compiler|transition|action|binding))/gi,
		value: 'Svelte',
	},
	{
		test: 'sveltekit',
		value: 'SvelteKit',
	},
	{
		test: /\bember\.?js\b/gi,
		value: 'Ember.js',
	},
	{
		test: /\bbackbone\.?js\b/gi,
		value: 'Backbone.js',
	},
	{
		test: /\bexpress\.?js\b/gi,
		value: 'Express.js',
	},
	{
		test: 'fastify',
		value: 'Fastify',
	},
	{
		test: /\bkoa\.?js\b/gi,
		value: 'Koa.js',
	},
	{
		test: 'django',
		value: 'Django',
	},
	{
		test: /\bflask\b(?=\s+(?:web|framework|python|development|app|application|server|microframework))/gi,
		value: 'Flask',
	},
	{
		test: 'fastapi',
		value: 'FastAPI',
	},
	{
		test: /\bruby\s?on\s?rails\b/gi,
		value: 'Ruby on Rails',
	},
	{
		test: /\brails\b(?=\s+(?:framework|app|controller|model|view|active|migration|gem|console|server|generator|action|route))/gi,
		value: 'Rails',
	},
	{
		test: /\bspring\b(?=\s+(?:framework|boot|mvc|cloud|security|data|batch|integration|web|java|application|microservice))/gi,
		value: 'Spring',
	},
	{
		test: /\bspring\s?boot\b/gi,
		value: 'Spring Boot',
	},
	{
		test: 'laravel',
		value: 'Laravel',
	},
	{
		test: 'symfony',
		value: 'Symfony',
	},
	{
		test: 'codeigniter',
		value: 'CodeIgniter',
	},
	{
		test: 'aspnet',
		value: 'ASP.NET',
	},
	{
		test: /\bnet\b(?=\s+(?:framework|core|platform|standard|runtime|application|api|library|assembly|maui|blazor|\d))/gi,
		value: '.NET',
	},
	{
		test: /\bbootstrap\b(?=\s+(?:css|framework|grid|responsive|component|theme|ui|design|frontend))/gi,
		value: 'Bootstrap',
	},
	{
		test: /\btailwind\s?css\b/gi,
		value: 'Tailwind CSS',
	},
	{
		test: /\bmaterial-?ui\b/gi,
		value: 'Material-UI',
	},
	{
		test: /\bant\s?design\b/gi,
		value: 'Ant Design',
	},
	{
		test: /\bchakra\s?ui\b/gi,
		value: 'Chakra UI',
	},

	{
		test: ['postgres', 'postgresql'],
		value: 'PostgreSQL',
	},
	{
		test: 'mysql',
		value: 'MySQL',
	},
	{
		test: [/\bmongo\s?db\b/gi, 'mongodb'],
		value: 'MongoDB',
	},
	{
		test: 'sqlite',
		value: 'SQLite',
	},
	{
		test: 'redis',
		value: 'Redis',
	},
	{
		test: 'elasticsearch',
		value: 'Elasticsearch',
	},
	{
		test: 'solr',
		value: 'Solr',
	},
	{
		test: 'cassandra',
		value: 'Cassandra',
	},
	{
		test: 'couchdb',
		value: 'CouchDB',
	},
	{
		test: 'neo4j',
		value: 'Neo4j',
	},
	{
		test: 'influxdb',
		value: 'InfluxDB',
	},
	{
		test: 'mariadb',
		value: 'MariaDB',
	},
	{
		test: 'dynamodb',
		value: 'DynamoDB',
	},
	{
		test: 'firestore',
		value: 'Firestore',
	},
	{
		test: 'supabase',
		value: 'Supabase',
	},
	{
		test: 'prisma',
		value: 'Prisma',
	},

	{
		test: 'docker',
		value: 'Docker',
	},
	{
		test: ['kubernetes', 'k8s'],
		value: 'Kubernetes',
	},
	{
		test: 'terraform',
		value: 'Terraform',
	},
	{
		test: 'ansible',
		value: 'Ansible',
	},
	{
		test: 'jenkins',
		value: 'Jenkins',
	},
	{
		test: /\bgitlab\s?ci\b/gi,
		value: 'GitLab CI',
	},
	{
		test: /\bgithub\s?actions\b/gi,
		value: 'GitHub Actions',
	},
	{
		test: /\btravis\s?ci\b/gi,
		value: 'Travis CI',
	},
	{
		test: 'circleci',
		value: 'CircleCI',
	},
	{
		test: 'aws',
		value: 'AWS',
	},
	{
		test: /\bamazon\s?web\s?services\b/gi,
		value: 'Amazon Web Services',
	},
	{
		test: /\bmicrosoft\s?azure\b/gi,
		value: 'Microsoft Azure',
	},
	{
		test: /\bgoogle\s?cloud\b/gi,
		value: 'Google Cloud',
	},
	{
		test: 'gcp',
		value: 'GCP',
	},
	{
		test: 'digitalocean',
		value: 'DigitalOcean',
	},
	{
		test: 'linode',
		value: 'Linode',
	},
	{
		test: 'vultr',
		value: 'Vultr',
	},
	{
		test: 'heroku',
		value: 'Heroku',
	},
	{
		test: 'vercel',
		value: 'Vercel',
	},
	{
		test: 'netlify',
		value: 'Netlify',
	},
	{
		test: 'cloudflare',
		value: 'Cloudflare',
	},

	{
		test: [/\bweb\s?assembly\b/gi, 'webassembly', 'wasm'],
		value: 'WebAssembly',
	},
	{
		test: [/\bgraph\s?ql\b/gi, 'graphql'],
		value: 'GraphQL',
	},
	{
		test: 'websocket',
		value: 'WebSocket',
	},
	{
		test: 'webrtc',
		value: 'WebRTC',
	},
	{
		test: 'pwa',
		value: 'PWA',
	},
	{
		test: /\bprogressive\s?web\s?app\b/gi,
		value: 'Progressive Web App',
	},
	{
		test: /\bservice\s?worker\b/gi,
		value: 'Service Worker',
	},
	{
		test: 'webgl',
		value: 'WebGL',
	},
	{
		test: 'webgpu',
		value: 'WebGPU',
	},
	{
		test: 'webpack',
		value: 'Webpack',
	},
	{
		test: 'vite',
		value: 'Vite',
	},
	{
		test: 'parcel',
		value: 'Parcel',
	},
	{
		test: 'rollup',
		value: 'Rollup',
	},
	{
		test: 'esbuild',
		value: 'esbuild',
	},
	{
		test: 'babel',
		value: 'Babel',
	},
	{
		test: 'swc',
		value: 'SWC',
	},
	{
		test: 'turbopack',
		value: 'Turbopack',
	},

	{
		test: 'jest',
		value: 'Jest',
	},
	{
		test: 'vitest',
		value: 'Vitest',
	},
	{
		test: 'mocha',
		value: 'Mocha',
	},
	{
		test: 'chai',
		value: 'Chai',
	},
	{
		test: 'jasmine',
		value: 'Jasmine',
	},
	{
		test: 'cypress',
		value: 'Cypress',
	},
	{
		test: 'playwright',
		value: 'Playwright',
	},
	{
		test: 'puppeteer',
		value: 'Puppeteer',
	},
	{
		test: 'selenium',
		value: 'Selenium',
	},
	{
		test: 'webdriver',
		value: 'WebDriver',
	},
	{
		test: 'storybook',
		value: 'Storybook',
	},

	{
		test: 'tensorflow',
		value: 'TensorFlow',
	},
	{
		test: 'pytorch',
		value: 'PyTorch',
	},
	{
		test: /\bscikit-?learn\b/gi,
		value: 'scikit-learn',
	},
	{
		test: 'keras',
		value: 'Keras',
	},
	{
		test: 'pandas',
		value: 'Pandas',
	},
	{
		test: 'numpy',
		value: 'NumPy',
	},
	{
		test: 'scipy',
		value: 'SciPy',
	},
	{
		test: 'matplotlib',
		value: 'Matplotlib',
	},
	{
		test: 'seaborn',
		value: 'Seaborn',
	},
	{
		test: 'jupyter',
		value: 'Jupyter',
	},
	{
		test: 'openai',
		value: 'OpenAI',
	},
	{
		test: /\bhugging\s?face\b/gi,
		value: 'Hugging Face',
	},
	{
		test: 'langchain',
		value: 'LangChain',
	},
	{
		test: 'llama',
		value: 'LLaMA',
	},
	{
		test: 'chatgpt',
		value: 'ChatGPT',
	},

	{
		test: /\breact\s?native\b/gi,
		value: 'React Native',
	},
	{
		test: /\bflutter\b(?=\s+(?:framework|app|development|dart|mobile|android|ios|widget|sdk))/gi,
		value: 'Flutter',
	},
	{
		test: 'xamarin',
		value: 'Xamarin',
	},
	{
		test: 'ionic',
		value: 'Ionic',
	},
	{
		test: 'cordova',
		value: 'Cordova',
	},
	{
		test: 'phonegap',
		value: 'PhoneGap',
	},
	{
		test: 'nativescript',
		value: 'NativeScript',
	},
	{
		test: 'expo',
		value: 'Expo',
	},

	{
		test: 'bitcoin',
		value: 'Bitcoin',
	},
	{
		test: 'ethereum',
		value: 'Ethereum',
	},
	{
		test: 'blockchain',
		value: 'Blockchain',
	},
	{
		test: 'solidity',
		value: 'Solidity',
	},
	{
		test: 'web3',
		value: 'Web3',
	},
	{
		test: 'nft',
		value: 'NFT',
	},
	{
		test: 'defi',
		value: 'DeFi',
	},
	{
		test: 'dao',
		value: 'DAO',
	},
	{
		test: 'metamask',
		value: 'MetaMask',
	},
	{
		test: 'openzeppelin',
		value: 'OpenZeppelin',
	},

	{
		test: /\bunity\b(?=\s+(?:engine|editor|3d|2d|game|development|asset|physics|animation|script|hub|version))/gi,
		value: 'Unity',
	},
	{
		test: /\bunreal\s?engine\b/gi,
		value: 'Unreal Engine',
	},
	{
		test: 'godot',
		value: 'Godot',
	},
	{
		test: 'blender',
		value: 'Blender',
	},
	{
		test: 'opengl',
		value: 'OpenGL',
	},
	{
		test: 'vulkan',
		value: 'Vulkan',
	},
	{
		test: 'directx',
		value: 'DirectX',
	},

	{
		test: 'ffmpeg',
		value: 'FFmpeg',
	},
	{
		test: 'imagemagick',
		value: 'ImageMagick',
	},
	{
		test: 'gimp',
		value: 'GIMP',
	},
	{
		test: 'inkscape',
		value: 'Inkscape',
	},
	{
		test: 'photoshop',
		value: 'Photoshop',
	},
	{
		test: 'illustrator',
		value: 'Illustrator',
	},
	{
		test: /\bafter\s?effects\b/gi,
		value: 'After Effects',
	},
	{
		test: /\bpremiere\s?pro\b/gi,
		value: 'Premiere Pro',
	},
	{
		test: 'figma',
		value: 'Figma',
	},
	{
		test: /\bsketch\b(?=\s+(?:app|design|plugin|library|file|document|artboard|symbol|cloud|mirror))/gi,
		value: 'Sketch',
	},
	{
		test: 'invision',
		value: 'InVision',
	},
	{
		test: 'canva',
		value: 'Canva',
	},

	{
		test: /\bstack\s?overflow\b/gi,
		value: 'Stack Overflow',
	},
	{
		test: /\byou\s?tube\b/gi,
		value: 'YouTube',
	},
	{
		test: /\bgit\s?hub\b/gi,
		value: 'GitHub',
	},
	{
		test: /\bgit\s?lab\b/gi,
		value: 'GitLab',
	},
	{
		test: 'bitbucket',
		value: 'Bitbucket',
	},
	{
		test: 'sourcetree',
		value: 'SourceTree',
	},
	{
		test: 'slack',
		value: 'Slack',
	},
	{
		test: /\bdiscord\b(?=\s+(?:bot|server|channel|api|webhook|slash|command|guild|voice|chat|app))/gi,
		value: 'Discord',
	},
	{
		test: /\bmicrosoft\s?teams\b/gi,
		value: 'Microsoft Teams',
	},
	{
		test: /\bzoom\b(?=\s+(?:meeting|call|video|conference|webinar|room|app|client|sdk|api))/gi,
		value: 'Zoom',
	},
	{
		test: 'trello',
		value: 'Trello',
	},
	{
		test: /\basana\b(?=\s+(?:task|project|workspace|team|api|integration|workflow|timeline|portfolio))/gi,
		value: 'Asana',
	},
	{
		test: /\bnotion\b(?=\s+(?:api|database|page|workspace|block|integration|formula|template|widget))/gi,
		value: 'Notion',
	},
	{
		test: /\bobsidian\b(?=\s+(?:vault|plugin|theme|note|graph|canvas|sync|publish|markdown))/gi,
		value: 'Obsidian',
	},
	{
		test: 'evernote',
		value: 'Evernote',
	},
	{
		test: 'onenote',
		value: 'OneNote',
	},
	{
		test: /\bgoogle\s?docs\b/gi,
		value: 'Google Docs',
	},
	{
		test: /\bgoogle\s?sheets\b/gi,
		value: 'Google Sheets',
	},
	{
		test: /\bgoogle\s?drive\b/gi,
		value: 'Google Drive',
	},
	{
		test: /\bmicrosoft\s?office\b/gi,
		value: 'Microsoft Office',
	},
	{
		test: /\boffice\s?365\b/gi,
		value: 'Office 365',
	},
	{
		test: 'sharepoint',
		value: 'SharePoint',
	},
	{
		test: 'dropbox',
		value: 'Dropbox',
	},
	{
		test: 'icloud',
		value: 'iCloud',
	},
	{
		test: 'onedrive',
		value: 'OneDrive',
	},

	{
		test: [/\bmac\s?os(?!\s?x)\b/gi, /(mac\s?)?os\s?x/gi],
		value: 'macOS',
	},
	{
		test: /\bwindows\b(?=\s+(?:10|11|server|os|operating|system|update|defender|terminal|subsystem|powershell|explorer|registry|app|application))/gi,
		value: 'Windows',
	},
	{
		test: 'linux',
		value: 'Linux',
	},
	{
		test: 'ubuntu',
		value: 'Ubuntu',
	},
	{
		test: 'debian',
		value: 'Debian',
	},
	{
		test: 'centos',
		value: 'CentOS',
	},
	{
		test: 'redhat',
		value: 'RedHat',
	},
	{
		test: 'fedora',
		value: 'Fedora',
	},
	{
		test: /\barch\s?linux\b/gi,
		value: 'Arch Linux',
	},
	{
		test: 'alpine',
		value: 'Alpine',
	},
	{
		test: 'freebsd',
		value: 'FreeBSD',
	},
	{
		test: 'openbsd',
		value: 'OpenBSD',
	},
	{
		test: 'netbsd',
		value: 'NetBSD',
	},
	{
		test: 'ios',
		value: 'iOS',
	},
	{
		test: 'android',
		value: 'Android',
	},
	{
		test: 'watchos',
		value: 'watchOS',
	},
	{
		test: 'tvos',
		value: 'tvOS',
	},
	{
		test: 'ipados',
		value: 'iPadOS',
	},

	{
		test: 'vscode',
		value: 'VSCode',
	},
	{
		test: /\bvisual\s?studio\s?code\b/gi,
		value: 'Visual Studio Code',
	},
	{
		test: /\bvisual\s?studio\b/gi,
		value: 'Visual Studio',
	},
	{
		test: 'intellij',
		value: 'IntelliJ',
	},
	{
		test: 'webstorm',
		value: 'WebStorm',
	},
	{
		test: 'pycharm',
		value: 'PyCharm',
	},
	{
		test: 'phpstorm',
		value: 'PhpStorm',
	},
	{
		test: 'goland',
		value: 'GoLand',
	},
	{
		test: 'rubymine',
		value: 'RubyMine',
	},
	{
		test: 'clion',
		value: 'CLion',
	},
	{
		test: 'rider',
		value: 'Rider',
	},
	{
		test: 'eclipse',
		value: 'Eclipse',
	},
	{
		test: 'netbeans',
		value: 'NetBeans',
	},
	{
		test: 'xcode',
		value: 'Xcode',
	},
	{
		test: /\bandroid\s?studio\b/gi,
		value: 'Android Studio',
	},
	{
		test: /\bsublime\s?text\b/gi,
		value: 'Sublime Text',
	},
	{
		test: /\batom\b(?=\s+(?:editor|package|theme|plugin|api|shell|ide|text|feed|xml|rss))/gi,
		value: 'Atom',
	},
	{
		test: 'brackets',
		value: 'Brackets',
	},
	{
		test: /\bvim\b(?=\s+(?:editor|command|terminal|text|config|plugin|script|mode))/gi,
		value: 'Vim',
	},
	{
		test: 'neovim',
		value: 'Neovim',
	},
	{
		test: 'emacs',
		value: 'Emacs',
	},
	{
		test: /\bnano\b(?=\s+(?:editor|text|command|terminal|config|file))/gi,
		value: 'Nano',
	},

	{
		test: 'git',
		value: 'Git',
	},
	{
		test: 'svn',
		value: 'SVN',
	},
	{
		test: 'mercurial',
		value: 'Mercurial',
	},
	{
		test: 'postman',
		value: 'Postman',
	},
	{
		test: 'insomnia',
		value: 'Insomnia',
	},
	{
		test: 'wireshark',
		value: 'Wireshark',
	},
];

export default spellCheckRules;
