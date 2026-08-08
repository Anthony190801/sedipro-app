// src/app/page.js
export default function Home() {
	const enlaces = [
		{
			nombre: "SEDICHAMPIONS",
			url: "/sedichampions",
			descripcion: "Sabado 8 de agosto",
			color: "from-yellow-400 to-orange-500"
		},
	];

	return (
		<main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
			<div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
				<div className="text-center mb-12">
					<h1 className="text-2xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
						Sedipro
						<span className="text-primary"> Frontend</span>
					</h1>
				</div>

				{/* Lista de enlaces  Front */}
				<ul className="space-y-4">
					{enlaces.map((enlace, index) => (
						<li key={index}>
							<a
								href={enlace.url}
								className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
							>
								<div className="flex items-center p-6 gap-4">
									<div className="flex-1 min-w-0">
										<h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
											{enlace.nombre}
										</h2>
										<p className="text-sm text-gray-500 truncate">
											{enlace.descripcion}
										</p>
									</div>
									<div className="flex-shrink-0 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all">
										<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
										</svg>
									</div>
								</div>
							</a>
						</li>
					))}
				</ul>

				{/* Footer */}
				<div className="mt-12 text-center text-sm text-gray-400">
					<p>© {new Date().getFullYear()} SEDIPRO UNT. Todos los derechos reservados</p>
				</div>
			</div>
		</main>
	);
}