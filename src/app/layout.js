// src/app/layout.js
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
	variable: "--font-montserrat",
	subsets: ["latin"],
	display: "swap",
});

const poppins = Poppins({
	variable: "--font-poppins",
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
	display: "swap",
});

export const metadata = {
	title: "SEDIPRO UNT | Sección Estudiantil de Dirección de Proyectos de la UNT",
	description: "SEDIPRO UNT - Sección Estudiantil de Dirección de Proyectos de la Universidad Nacional de Trujillo (UNT), un equipo multidisciplinario de estudiantes comprometidos con el desarrollo y progreso de la sociedad.",
	keywords: "SEDIPRO, UNT, Dirección de Proyectos, Universidad Nacional de Trujillo, estudiantes, gestión de proyectos",
	authors: [{ name: "SEDIPRO UNT" }],
	creator: "SEDIPRO UNT",
	robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",

	icons: {
		icon: [
			{ url: '/favicon.svg', type: 'image/svg+xml' },
			{ url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
			{ url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
			{ url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
		],
		apple: '/apple-touch-icon.png',
		shortcut: '/favicon.ico',
	},

	appleWebApp: {
		capable: true,
		statusBarStyle: 'black-translucent',
		title: 'SEDIPRO UNT',
	},

	openGraph: {
		title: 'SEDIPRO UNT',
		description: 'Sección Estudiantil de Dirección de Proyectos de la Universidad Nacional de Trujillo',
		url: 'https://sediprount.org',
		siteName: 'SEDIPRO UNT',
		images: [
			{
				url: 'https://sediprount.org/og-image.webp',
				width: 1200,
				height: 630,
				alt: 'SEDIPRO UNT - Portada',
				type: 'image/webp',
			},
		],
		type: 'website',
		locale: 'es_PE',
	},

	twitter: {
		card: 'summary_large_image',
		title: 'SEDIPRO UNT',
		description: 'Sección Estudiantil de Dirección de Proyectos de la UNT',
		images: ['https://sediprount.org/og-image.webp'],
		creator: '@SediproUNT',
		site: '@SediproUNT',
	},

	metadataBase: new URL('https://sediprount.org'),

	alternates: {
		canonical: 'https://sediprount.org',
		languages: {
			'es-PE': 'https://sediprount.org',
		},
	},
};

export default function RootLayout({ children }) {
	return (
		<html
			lang="es"
			className={`${montserrat.variable} ${poppins.variable} h-full antialiased`}
		>
			<body className="min-h-full flex flex-col font-poppins">
				{children}
			</body>
		</html>
	);
}