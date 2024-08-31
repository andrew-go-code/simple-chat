import 'dotenv/config'

export default {
	'expo': {
		'name': 'simple-chat',
		'slug': 'simple-chat',
		'version': '1.0.0',
		'orientation': 'portrait',
		'icon': './assets/icon.png',
		'userInterfaceStyle': 'light',
		'splash': {
			'image': './assets/splash.png',
			'resizeMode': 'contain',
			'backgroundColor': '#ffffff'
		},
		'ios': {
			'supportsTablet': true
		},
		'android': {
			'adaptiveIcon': {
				'foregroundImage': './assets/adaptive-icon.png',
				'backgroundColor': '#ffffff',
			},
			package: 'com.andrewjvcr.simplechat'
		},
		'web': {
			'favicon': './assets/favicon.png'
		},
		extra: {
			apiKey: process.env.API_KEY,
			authDomain: process.env.AUTH_DOMAIN,
			projectId: process.env.PROJECT_ID,
			storageBucket: process.env.STORAGE_BUCKET,
			messagingSenderId: process.env.MESSAGING_SENDER_ID,
			appId: process.env.APP_ID,
			eas: {
				projectId: '0b4e7f91-e67f-45fe-8b0f-36df4573ee07'
			}
		},
	}
}
