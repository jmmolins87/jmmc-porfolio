import { Q as UnknownContentCollectionError, U as RenderUndefinedEntryError, nt as AstroError } from "./errors-data_D7NJRD9d.mjs";
import { C as renderUniqueStylesheet, D as renderTemplate, E as renderSlot, F as createAstro, I as createComponent, M as addAttribute, N as createHeadAndContent, P as unescapeHTML, S as renderScriptElement, T as renderComponent, at as isRemotePath, ct as removeBase, j as renderHead, k as generateCspDigest, st as prependForwardSlash, x as spreadAttributes } from "./fetch-state_BoCD520l.mjs";
import { r as VALID_INPUT_FORMATS } from "./consts_Bx4_lkUX.mjs";
import "./compiler_DyFx8Fte.mjs";
/* empty css                  */
import * as devalue from "devalue";
import { escape } from "html-escaper";
import * as z from "zod/v4";
import { Traverse } from "neotraverse/modern";
//#region node_modules/astro/dist/assets/runtime.js
function createSvgComponent({ meta, attributes, children, styles }) {
	const hasStyles = styles.length > 0;
	const Component = createComponent({
		async factory(result, props) {
			const normalizedProps = normalizeProps(attributes, props);
			if (hasStyles && result.cspDestination) for (const style of styles) {
				const hash = await generateCspDigest(style, result.cspAlgorithm);
				result._metadata.extraStyleHashes.push(hash);
			}
			return renderTemplate`<svg${spreadAttributes(normalizedProps)}>${unescapeHTML(children)}</svg>`;
		},
		propagation: hasStyles ? "self" : "none"
	});
	Object.defineProperty(Component, "toJSON", {
		value: () => meta,
		enumerable: false
	});
	return Object.assign(Component, meta);
}
var ATTRS_TO_DROP = [
	"xmlns",
	"xmlns:xlink",
	"version"
];
var DEFAULT_ATTRS = {};
function dropAttributes(attributes) {
	for (const attr of ATTRS_TO_DROP) delete attributes[attr];
	return attributes;
}
function normalizeProps(attributes, props) {
	return dropAttributes({
		...DEFAULT_ATTRS,
		...attributes,
		...props
	});
}
var CONTENT_IMAGE_FLAG = "astroContentImageFlag";
var IMAGE_IMPORT_PREFIX = "__ASTRO_IMAGE_";
//#endregion
//#region node_modules/astro/dist/assets/utils/resolveImports.js
function imageSrcToImportId(imageSrc, filePath) {
	imageSrc = removeBase(imageSrc, IMAGE_IMPORT_PREFIX);
	if (isRemotePath(imageSrc)) return;
	const ext = imageSrc.split(".").at(-1)?.toLowerCase();
	if (!ext || !VALID_INPUT_FORMATS.includes(ext)) return;
	const params = new URLSearchParams(CONTENT_IMAGE_FLAG);
	if (filePath) params.set("importer", filePath);
	return `${imageSrc}?${params.toString()}`;
}
//#endregion
//#region node_modules/astro/dist/content/data-store.js
var ImmutableDataStore = class ImmutableDataStore {
	_collections = /* @__PURE__ */ new Map();
	constructor() {
		this._collections = /* @__PURE__ */ new Map();
	}
	get(collectionName, key) {
		return this._collections.get(collectionName)?.get(String(key));
	}
	entries(collectionName) {
		return [...(this._collections.get(collectionName) ?? /* @__PURE__ */ new Map()).entries()];
	}
	values(collectionName) {
		return [...(this._collections.get(collectionName) ?? /* @__PURE__ */ new Map()).values()];
	}
	keys(collectionName) {
		return [...(this._collections.get(collectionName) ?? /* @__PURE__ */ new Map()).keys()];
	}
	has(collectionName, key) {
		const collection = this._collections.get(collectionName);
		if (collection) return collection.has(String(key));
		return false;
	}
	hasCollection(collectionName) {
		return this._collections.has(collectionName);
	}
	collections() {
		return this._collections;
	}
	/**
	* Attempts to load a DataStore from the virtual module.
	* This only works in Vite.
	*/
	static async fromModule() {
		try {
			const data = await import("./_astro_data-layer-content_Bp7C9Nr2.mjs");
			if (data.default instanceof Map) return ImmutableDataStore.fromMap(data.default);
			const map = devalue.unflatten(data.default);
			return ImmutableDataStore.fromMap(map);
		} catch {}
		return new ImmutableDataStore();
	}
	static async fromMap(data) {
		const store = new ImmutableDataStore();
		store._collections = data;
		return store;
	}
};
function dataStoreSingleton() {
	let instance = void 0;
	return {
		get: async () => {
			if (!instance) instance = ImmutableDataStore.fromModule();
			return instance;
		},
		set: (store) => {
			instance = store;
		}
	};
}
var globalDataStore = dataStoreSingleton();
//#endregion
//#region node_modules/astro/dist/content/loaders/errors.js
function formatZodError(error) {
	return error.issues.map((issue) => `  **${issue.path.join(".")}**: ${issue.message}`);
}
var LiveCollectionError = class LiveCollectionError extends Error {
	collection;
	message;
	cause;
	constructor(collection, message, cause) {
		super(message);
		this.collection = collection;
		this.message = message;
		this.cause = cause;
		this.name = "LiveCollectionError";
		if (cause?.stack) this.stack = cause.stack;
	}
	static is(error) {
		return error instanceof LiveCollectionError;
	}
};
var LiveEntryNotFoundError = class extends LiveCollectionError {
	constructor(collection, entryFilter) {
		super(collection, `Entry ${collection} \u2192 ${typeof entryFilter === "string" ? entryFilter : JSON.stringify(entryFilter)} was not found.`);
		this.name = "LiveEntryNotFoundError";
	}
	static is(error) {
		return error?.name === "LiveEntryNotFoundError";
	}
};
var LiveCollectionValidationError = class extends LiveCollectionError {
	constructor(collection, entryId, error) {
		super(collection, [
			`**${collection} \u2192 ${entryId}** data does not match the collection schema.
`,
			...formatZodError(error),
			""
		].join("\n"));
		this.name = "LiveCollectionValidationError";
	}
	static is(error) {
		return error?.name === "LiveCollectionValidationError";
	}
};
var LiveCollectionCacheHintError = class extends LiveCollectionError {
	constructor(collection, entryId, error) {
		super(collection, [
			`**${String(collection)}${entryId ? ` \u2192 ${String(entryId)}` : ""}** returned an invalid cache hint.
`,
			...formatZodError(error),
			""
		].join("\n"));
		this.name = "LiveCollectionCacheHintError";
	}
	static is(error) {
		return error?.name === "LiveCollectionCacheHintError";
	}
};
//#endregion
//#region node_modules/astro/dist/content/runtime.js
var cacheHintSchema = z.object({
	tags: z.array(z.string()).optional(),
	lastModified: z.date().optional()
});
async function parseLiveEntry(entry, schema, collection) {
	try {
		const parsed = await z.safeParseAsync(schema, entry.data);
		if (!parsed.success) return { error: new LiveCollectionValidationError(collection, entry.id, parsed.error) };
		if (entry.cacheHint) {
			const cacheHint = cacheHintSchema.safeParse(entry.cacheHint);
			if (!cacheHint.success) return { error: new LiveCollectionCacheHintError(collection, entry.id, cacheHint.error) };
			entry.cacheHint = cacheHint.data;
		}
		return { entry: {
			...entry,
			data: parsed.data
		} };
	} catch (error) {
		return { error: new LiveCollectionError(collection, `Unexpected error parsing entry ${entry.id} in collection ${collection}`, error) };
	}
}
function createGetCollection({ liveCollections }) {
	return async function getCollection(collection, filter) {
		if (collection in liveCollections) throw new AstroError({
			...UnknownContentCollectionError,
			message: `Collection "${collection}" is a live collection. Use getLiveCollection() instead of getCollection().`
		});
		const hasFilter = typeof filter === "function";
		const store = await globalDataStore.get();
		if (store.hasCollection(collection)) {
			const { default: imageAssetMap } = await import("./content-assets_DXqEyLLP.mjs");
			const result = [];
			for (const rawEntry of store.values(collection)) {
				const data = updateImageReferencesInData(rawEntry.data, rawEntry.filePath, imageAssetMap);
				let entry = {
					...rawEntry,
					data,
					collection
				};
				if (hasFilter && !filter(entry)) continue;
				result.push(entry);
			}
			return result;
		} else {
			console.warn(`The collection ${JSON.stringify(collection)} does not exist or is empty. Please check your content config file for errors.`);
			return [];
		}
	};
}
function createGetEntry({ liveCollections }) {
	return async function getEntry(collectionOrLookupObject, lookup) {
		let collection, lookupId;
		if (typeof collectionOrLookupObject === "string") {
			collection = collectionOrLookupObject;
			if (!lookup) throw new AstroError({
				...UnknownContentCollectionError,
				message: "`getEntry()` requires an entry identifier as the second argument."
			});
			lookupId = lookup;
		} else {
			collection = collectionOrLookupObject.collection;
			lookupId = "id" in collectionOrLookupObject ? collectionOrLookupObject.id : collectionOrLookupObject.slug;
		}
		if (collection in liveCollections) throw new AstroError({
			...UnknownContentCollectionError,
			message: `Collection "${collection}" is a live collection. Use getLiveEntry() instead of getEntry().`
		});
		if (typeof lookupId === "object") throw new AstroError({
			...UnknownContentCollectionError,
			message: `The entry identifier must be a string. Received object.`
		});
		const store = await globalDataStore.get();
		if (store.hasCollection(collection)) {
			const entry = store.get(collection, lookupId);
			if (!entry) {
				console.warn(`Entry ${collection} → ${lookupId} was not found.`);
				return;
			}
			const { default: imageAssetMap } = await import("./content-assets_DXqEyLLP.mjs");
			const data = updateImageReferencesInData(entry.data, entry.filePath, imageAssetMap);
			const result = {
				...entry,
				data,
				collection
			};
			warnForPropertyAccess(result.data, "slug", `[content] Attempted to access deprecated property on "${collection}" entry.
The "slug" property is no longer automatically added to entries. Please use the "id" property instead.`);
			warnForPropertyAccess(result, "render", `[content] Invalid attempt to access "render()" method on "${collection}" entry.
To render an entry, use "render(entry)" from "astro:content".`);
			return result;
		}
	};
}
function warnForPropertyAccess(entry, prop, message) {
	if (!(prop in entry)) {
		let _value = void 0;
		Object.defineProperty(entry, prop, {
			get() {
				if (_value === void 0) console.error(message);
				return _value;
			},
			set(v) {
				_value = v;
			},
			enumerable: false
		});
	}
}
function createGetLiveCollection({ liveCollections }) {
	return async function getLiveCollection(collection, filter) {
		if (!(collection in liveCollections)) return { error: new LiveCollectionError(collection, `Collection "${collection}" is not a live collection. Use getCollection() instead of getLiveCollection() to load regular content collections.`) };
		try {
			const context = {
				filter,
				collection
			};
			const response = await liveCollections[collection].loader?.loadCollection?.(context);
			if (response && "error" in response) return { error: response.error };
			const { schema } = liveCollections[collection];
			let processedEntries = response.entries;
			if (schema) {
				const entryResults = await Promise.all(response.entries.map((entry) => parseLiveEntry(entry, schema, collection)));
				for (const result of entryResults) if (result.error) return { error: result.error };
				processedEntries = entryResults.map((result) => result.entry);
			}
			let cacheHint = response.cacheHint;
			if (cacheHint) {
				const cacheHintResult = cacheHintSchema.safeParse(cacheHint);
				if (!cacheHintResult.success) return { error: new LiveCollectionCacheHintError(collection, void 0, cacheHintResult.error) };
				cacheHint = cacheHintResult.data;
			}
			if (processedEntries.length > 0) {
				const entryTags = /* @__PURE__ */ new Set();
				let latestModified;
				for (const entry of processedEntries) if (entry.cacheHint) {
					if (entry.cacheHint.tags) entry.cacheHint.tags.forEach((tag) => entryTags.add(tag));
					if (entry.cacheHint.lastModified instanceof Date) {
						if (latestModified === void 0 || entry.cacheHint.lastModified > latestModified) latestModified = entry.cacheHint.lastModified;
					}
				}
				if (entryTags.size > 0 || latestModified || cacheHint) {
					const mergedCacheHint = {};
					if (cacheHint?.tags || entryTags.size > 0) mergedCacheHint.tags = [.../* @__PURE__ */ new Set([...cacheHint?.tags || [], ...entryTags])];
					if (cacheHint?.lastModified && latestModified) mergedCacheHint.lastModified = cacheHint.lastModified > latestModified ? cacheHint.lastModified : latestModified;
					else if (cacheHint?.lastModified || latestModified) mergedCacheHint.lastModified = cacheHint?.lastModified ?? latestModified;
					cacheHint = mergedCacheHint;
				}
			}
			return {
				entries: processedEntries,
				cacheHint
			};
		} catch (error) {
			return { error: new LiveCollectionError(collection, `Unexpected error loading collection ${collection}${error instanceof Error ? `: ${error.message}` : ""}`, error) };
		}
	};
}
function createGetLiveEntry({ liveCollections }) {
	return async function getLiveEntry(collection, lookup) {
		if (!(collection in liveCollections)) return { error: new LiveCollectionError(collection, `Collection "${collection}" is not a live collection. Use getCollection() instead of getLiveEntry() to load regular content collections.`) };
		try {
			const lookupObject = {
				filter: typeof lookup === "string" ? { id: lookup } : lookup,
				collection
			};
			let entry = await liveCollections[collection].loader?.loadEntry?.(lookupObject);
			if (entry && "error" in entry) return { error: entry.error };
			if (!entry) return { error: new LiveEntryNotFoundError(collection, lookup) };
			const { schema } = liveCollections[collection];
			if (schema) {
				const result = await parseLiveEntry(entry, schema, collection);
				if (result.error) return { error: result.error };
				entry = result.entry;
			}
			return {
				entry,
				cacheHint: entry.cacheHint
			};
		} catch (error) {
			return { error: new LiveCollectionError(collection, `Unexpected error loading entry ${collection} → ${typeof lookup === "string" ? lookup : JSON.stringify(lookup)}`, error) };
		}
	};
}
var CONTENT_LAYER_IMAGE_REGEX = /__ASTRO_IMAGE_="([^"]+)"/g;
async function updateImageReferencesInBody(html, fileName) {
	const { default: imageAssetMap } = await import("./content-assets_DXqEyLLP.mjs");
	const imageObjects = /* @__PURE__ */ new Map();
	const { getImage } = await import("./_virtual_astro_get-image_DfFRni4w.mjs");
	for (const [_full, imagePath] of html.matchAll(CONTENT_LAYER_IMAGE_REGEX)) try {
		const decodedImagePath = JSON.parse(imagePath.replace(/&(?:#x22|quot);/g, "\"").replace(/&(?:#x27|apos);/g, "'"));
		let image;
		if (URL.canParse(decodedImagePath.src)) image = await getImage(decodedImagePath);
		else {
			const id = imageSrcToImportId(decodedImagePath.src, fileName);
			const imported = imageAssetMap.get(id);
			if (!id || imageObjects.has(id) || !imported) continue;
			image = await getImage({
				...decodedImagePath,
				src: imported
			});
		}
		imageObjects.set(imagePath, image);
	} catch {
		throw new Error(`Failed to parse image reference: ${imagePath}`);
	}
	return html.replaceAll(CONTENT_LAYER_IMAGE_REGEX, (full, imagePath) => {
		const image = imageObjects.get(imagePath);
		if (!image) return full;
		const { index, ...attributes } = image.attributes;
		return Object.entries({
			...attributes,
			src: image.src,
			srcset: image.srcSet.attribute
		}).filter(([, value]) => value != null).map(([key, value]) => value === "" ? `${key}=""` : `${key}="${escape(String(value))}"`).join(" ");
	});
}
function updateImageReferencesInData(data, fileName, imageAssetMap) {
	const copy = structuredClone(data);
	new Traverse(copy).forEach(function(ctx, val) {
		if (typeof val === "string" && val.startsWith("__ASTRO_IMAGE_")) {
			const src = val.replace(IMAGE_IMPORT_PREFIX, "");
			const id = imageSrcToImportId(src, fileName);
			if (!id) {
				ctx.update(src);
				return;
			}
			const imported = imageAssetMap?.get(id);
			if (imported) if (imported.__svgData) {
				const { __svgData: svgData, ...meta } = imported;
				ctx.update(createSvgComponent({
					meta,
					...svgData
				}));
			} else ctx.update(imported);
			else ctx.update(src);
		}
	});
	return copy;
}
async function renderEntry(entry) {
	if (!entry) throw new AstroError(RenderUndefinedEntryError);
	if (entry.deferredRender) try {
		const { default: contentModules } = await import("./content-modules_I7QRxwaA.mjs");
		const renderEntryImport = contentModules.get(entry.filePath);
		return render({
			collection: "",
			id: entry.id,
			renderEntryImport
		});
	} catch (e) {
		console.error(e);
	}
	const html = entry?.rendered?.metadata?.imagePaths?.length && entry.filePath ? await updateImageReferencesInBody(entry.rendered.html, entry.filePath) : entry?.rendered?.html;
	return {
		Content: createComponent(() => renderTemplate`${unescapeHTML(html)}`),
		headings: entry?.rendered?.metadata?.headings ?? [],
		remarkPluginFrontmatter: entry?.rendered?.metadata?.frontmatter ?? {}
	};
}
async function render({ collection, id, renderEntryImport }) {
	const UnexpectedRenderError = new AstroError({
		...UnknownContentCollectionError,
		message: `Unexpected error while rendering ${String(collection)} → ${String(id)}.`
	});
	if (typeof renderEntryImport !== "function") throw UnexpectedRenderError;
	const baseMod = await renderEntryImport();
	if (baseMod == null || typeof baseMod !== "object") throw UnexpectedRenderError;
	const { default: defaultMod } = baseMod;
	if (isPropagatedAssetsModule(defaultMod)) {
		const { collectedStyles, collectedLinks, collectedScripts, getMod } = defaultMod;
		if (typeof getMod !== "function") throw UnexpectedRenderError;
		const propagationMod = await getMod();
		if (propagationMod == null || typeof propagationMod !== "object") throw UnexpectedRenderError;
		return {
			Content: createComponent({
				factory(result, baseProps, slots) {
					let styles = "", links = "", scripts = "";
					if (Array.isArray(collectedStyles)) styles = collectedStyles.map((style) => {
						return renderUniqueStylesheet(result, {
							type: "inline",
							content: style
						});
					}).join("");
					if (Array.isArray(collectedLinks)) links = collectedLinks.map((link) => {
						return renderUniqueStylesheet(result, {
							type: "external",
							src: isRemotePath(link) ? link : prependForwardSlash(link)
						});
					}).join("");
					if (Array.isArray(collectedScripts)) scripts = collectedScripts.map((script) => renderScriptElement(script)).join("");
					let props = baseProps;
					if (id.endsWith("mdx")) props = {
						components: propagationMod.components ?? {},
						...baseProps
					};
					return createHeadAndContent(unescapeHTML(styles + links + scripts), renderTemplate`${renderComponent(result, "Content", propagationMod.Content, props, slots)}`);
				},
				propagation: "self"
			}),
			headings: propagationMod.getHeadings?.() ?? [],
			remarkPluginFrontmatter: propagationMod.frontmatter ?? {}
		};
	} else if (baseMod.Content && typeof baseMod.Content === "function") return {
		Content: baseMod.Content,
		headings: baseMod.getHeadings?.() ?? [],
		remarkPluginFrontmatter: baseMod.frontmatter ?? {}
	};
	else throw UnexpectedRenderError;
}
function isPropagatedAssetsModule(module) {
	return typeof module === "object" && module != null && "__astroPropagation" in module;
}
//#endregion
//#region \0astro:content
var liveCollections = {};
var getCollection = createGetCollection({ liveCollections });
var getEntry = createGetEntry({ liveCollections });
createGetLiveCollection({ liveCollections });
createGetLiveEntry({ liveCollections });
//#endregion
//#region src/lib/i18n.ts
var translations = {
	es: {
		"nav.home": "Inicio",
		"nav.about": "Sobre mí",
		"nav.skills": "Stack",
		"nav.experience": "Experiencia",
		"nav.projects": "Proyectos",
		"nav.services": "Servicios",
		"nav.blog": "Blog",
		"nav.contact": "Contacto",
		"hero.greeting": "Hola, soy",
		"hero.name": "Juanma MC",
		"hero.role": "Fullstack Developer, AI & Automation Builder",
		"hero.description": "Construyo productos digitales, sistemas escalables y soluciones impulsadas por IA para negocios modernos.",
		"hero.cta.projects": "Ver proyectos",
		"hero.cta.contact": "Contacto",
		"hero.scroll": "Desliza para explorar",
		"about.title": "Sobre mí",
		"about.bio": "Desarrollador fullstack con experiencia en React, Node.js, TypeScript y automatizaciones con IA. Me apasiona construir sistemas que resuelvan problemas reales y crear experiencias digitales memorables.",
		"about.location": "Madrid, España",
		"about.projects": "proyectos",
		"about.clients": "clientes",
		"about.experience": "años de experiencia",
		"skills.title": "Stack Tecnológico",
		"skills.frontend": "Frontend",
		"skills.backend": "Backend",
		"skills.devops": "DevOps & Cloud",
		"skills.ai": "IA & Automatización",
		"experience.title": "Experiencia",
		"experience.role1": "Senior Frontend Developer",
		"experience.company1": "Custos Mobile",
		"experience.period1": "11/2025 - Actualidad",
		"experience.desc1": "Desarrollo de pasarelas de pago, dashboards de gestión remota de terminales y TPV. Gestión del equipo front, revisión de PR y diseño técnico de productos. Integración de IA, MCP, Skills y Agents. Storybook, Material UI, CI/CD con GitLab y GitHub.",
		"experience.role2": "Senior Angular Developer",
		"experience.company2": "Accenture",
		"experience.period2": "05/2023 - Actualidad",
		"experience.desc2": "Desarrollo de la aplicación web del Banco Santander con Angular 14+, TypeScript, Material UI y Tailwind CSS. Creación de componentes web reutilizables con Storybook. CI/CD con Jenkins.",
		"experience.role3": "Angular Developer",
		"experience.company3": "ViewNext",
		"experience.period3": "06/2021 - 05/2023",
		"experience.desc3": "Desarrollo front-end y diseño de la plataforma web del Banco Santander con Angular 14+ y TypeScript. CI/CD con GitHub. Desarrollo backend con Node.js.",
		"experience.role4": "Angular Developer",
		"experience.company4": "Dimática Software",
		"experience.period4": "06/2020 - 06/2021",
		"experience.desc4": "Desarrollo y mantenimiento de aplicaciones web con Angular, Material UI y Tailwind CSS. Control de versiones con Git.",
		"experience.role5": "Frontend Developer | UI Designer",
		"experience.company5": "Nateevo",
		"experience.period5": "11/2019 - 04/2020",
		"experience.desc5": "Desarrollo web con JavaScript, jQuery y Pug. Implementación de diseños responsive con alta fidelidad. Control de versiones con Git.",
		"experience.role6": "Angular Developer",
		"experience.company6": "Everis (NTT Data)",
		"experience.period6": "08/2018 - 11/2019",
		"experience.desc6": "Desarrollo front-end y diseño de la plataforma web de Orange con Angular e Ionic. Desarrollo backend con Node.js.",
		"projects.title": "Proyectos",
		"projects.view": "Ver proyecto",
		"projects.viewAll": "Ver todos los proyectos",
		"services.title": "Servicios",
		"services.web.title": "Desarrollo Web Fullstack",
		"services.web.desc": "Aplicaciones web modernas con React, Astro, Node.js y TypeScript. Desde landing pages hasta plataformas complejas.",
		"services.ai.title": "IA y Automatización",
		"services.ai.desc": "Integración de modelos de IA, automatización de flujos de trabajo y chatbots inteligentes.",
		"services.consulting.title": "Consultoría Técnica",
		"services.consulting.desc": "Arquitectura de sistemas, code review, y asesoramiento técnico para equipos de desarrollo.",
		"blog.title": "Blog",
		"blog.readMore": "Leer más",
		"blog.minRead": "min de lectura",
		"contact.title": "Contacto",
		"contact.subtitle": "¿Tienes un proyecto en mente? ¿O solo quieres saludar?",
		"contact.name": "Nombre",
		"contact.email": "Email",
		"contact.message": "Mensaje",
		"contact.send": "Enviar mensaje",
		"contact.sending": "Enviando...",
		"contact.success": "Mensaje enviado correctamente",
		"contact.error": "Error al enviar el mensaje",
		"footer.copyright": "© 2026 Juanma MC. Todos los derechos reservados.",
		"footer.backToTop": "Volver arriba",
		"seo.title": "Juanma MC | Fullstack Developer, AI & Automation Builder",
		"seo.description": "Desarrollador fullstack construyendo productos digitales, sistemas escalables, soluciones con IA y automatizaciones para negocios modernos.",
		"seo.ogTitle": "Juanma MC | Fullstack Developer",
		"seo.ogDescription": "Portfolio de Juanma MC - Fullstack Developer especializado en AI y Automatizaciones"
	},
	en: {
		"nav.home": "Home",
		"nav.about": "About",
		"nav.skills": "Stack",
		"nav.experience": "Experience",
		"nav.projects": "Projects",
		"nav.services": "Services",
		"nav.blog": "Blog",
		"nav.contact": "Contact",
		"hero.greeting": "Hi, I'm",
		"hero.name": "Juanma MC",
		"hero.role": "Fullstack Developer, AI & Automation Builder",
		"hero.description": "I build digital products, scalable systems, and AI-driven solutions for modern businesses.",
		"hero.cta.projects": "View projects",
		"hero.cta.contact": "Contact me",
		"hero.scroll": "Scroll to explore",
		"about.title": "About Me",
		"about.bio": "Fullstack developer with experience in React, Node.js, TypeScript, and AI automations. I love building systems that solve real problems and crafting memorable digital experiences.",
		"about.location": "Madrid, Spain",
		"about.projects": "projects",
		"about.clients": "clients",
		"about.experience": "years of experience",
		"skills.title": "Tech Stack",
		"skills.frontend": "Frontend",
		"skills.backend": "Backend",
		"skills.devops": "DevOps & Cloud",
		"skills.ai": "AI & Automation",
		"experience.title": "Experience",
		"experience.role1": "Senior Frontend Developer",
		"experience.company1": "Custos Mobile",
		"experience.period1": "11/2025 - Present",
		"experience.desc1": "Development of payment gateways, remote terminal management dashboards, and POS systems. Frontend team management, PR reviews, and technical product design. AI integration with MCP, Skills, and Agents. Storybook, Material UI, CI/CD with GitLab and GitHub.",
		"experience.role2": "Senior Angular Developer",
		"experience.company2": "Accenture",
		"experience.period2": "05/2023 - Present",
		"experience.desc2": "Development of Banco Santander's web application with Angular 14+, TypeScript, Material UI, and Tailwind CSS. Reusable web components with Storybook. CI/CD with Jenkins.",
		"experience.role3": "Angular Developer",
		"experience.company3": "ViewNext",
		"experience.period3": "06/2021 - 05/2023",
		"experience.desc3": "Front-end development and design of Banco Santander's web platform with Angular 14+ and TypeScript. CI/CD with GitHub. Backend development with Node.js.",
		"experience.role4": "Angular Developer",
		"experience.company4": "Dimática Software",
		"experience.period4": "06/2020 - 06/2021",
		"experience.desc4": "Web application development and maintenance with Angular, Material UI, and Tailwind CSS. Version control with Git.",
		"experience.role5": "Frontend Developer | UI Designer",
		"experience.company5": "Nateevo",
		"experience.period5": "11/2019 - 04/2020",
		"experience.desc5": "Web development with JavaScript, jQuery, and Pug. High-fidelity responsive design implementation. Version control with Git.",
		"experience.role6": "Angular Developer",
		"experience.company6": "Everis (NTT Data)",
		"experience.period6": "08/2018 - 11/2019",
		"experience.desc6": "Front-end development and design of Orange's web platform with Angular and Ionic. Backend development with Node.js.",
		"projects.title": "Projects",
		"projects.view": "View project",
		"projects.viewAll": "View all projects",
		"services.title": "Services",
		"services.web.title": "Fullstack Web Development",
		"services.web.desc": "Modern web apps with React, Astro, Node.js, and TypeScript. From landing pages to complex platforms.",
		"services.ai.title": "AI & Automation",
		"services.ai.desc": "AI model integration, workflow automation, and intelligent chatbots.",
		"services.consulting.title": "Technical Consulting",
		"services.consulting.desc": "System architecture, code review, and technical advisory for development teams.",
		"blog.title": "Blog",
		"blog.readMore": "Read more",
		"blog.minRead": "min read",
		"contact.title": "Contact",
		"contact.subtitle": "Got a project in mind? Or just want to say hi?",
		"contact.name": "Name",
		"contact.email": "Email",
		"contact.message": "Message",
		"contact.send": "Send message",
		"contact.sending": "Sending...",
		"contact.success": "Message sent successfully",
		"contact.error": "Error sending message",
		"footer.copyright": "© 2026 Juanma MC. All rights reserved.",
		"footer.backToTop": "Back to top",
		"seo.title": "Juanma MC | Fullstack Developer, AI & Automation Builder",
		"seo.description": "Fullstack developer building digital products, scalable systems, AI-driven solutions, and automations for modern businesses.",
		"seo.ogTitle": "Juanma MC | Fullstack Developer",
		"seo.ogDescription": "Juanma MC's portfolio - Fullstack Developer specialized in AI & Automation"
	}
};
function t(locale, key) {
	return translations[locale]?.[key] ?? key;
}
//#endregion
//#region src/layouts/BaseLayout.astro
createAstro("https://jmmc.vercel.app");
var $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$BaseLayout;
	const { locale } = Astro.props;
	const title = Astro.props.title ?? t(locale, "seo.title");
	const description = Astro.props.description ?? t(locale, "seo.description");
	const ogTitle = Astro.props.ogTitle ?? t(locale, "seo.ogTitle");
	const ogDescription = Astro.props.ogDescription ?? t(locale, "seo.ogDescription");
	const ogImage = Astro.props.ogImage ?? "https://jmmc.vercel.app/og-image.jpg";
	const siteUrl = "https://jmmc.vercel.app";
	const canonical = `${siteUrl}/${locale}/`;
	return renderTemplate`<html${addAttribute(locale, "lang")}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title><meta name="description"${addAttribute(description, "content")}><meta name="author" content="Juanma MC"><meta name="creator" content="Juanma MC"><meta name="robots" content="index, follow"><meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1"><link rel="canonical"${addAttribute(canonical, "href")}><link rel="alternate" hreflang="es"${addAttribute(`${siteUrl}/es/`, "href")}><link rel="alternate" hreflang="en"${addAttribute(`${siteUrl}/en/`, "href")}><link rel="alternate" hreflang="x-default"${addAttribute(`${siteUrl}/es/`, "href")}><meta property="og:title"${addAttribute(ogTitle, "content")}><meta property="og:description"${addAttribute(ogDescription, "content")}><meta property="og:url"${addAttribute(canonical, "content")}><meta property="og:site_name" content="Juanma MC Portfolio"><meta property="og:locale"${addAttribute(locale === "es" ? "es_ES" : "en_US", "content")}><meta property="og:image"${addAttribute(ogImage, "content")}><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:type" content="website"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"${addAttribute(ogTitle, "content")}><meta name="twitter:description"${addAttribute(ogDescription, "content")}><meta name="twitter:image"${addAttribute(ogImage, "content")}><link rel="icon" type="image/x-icon" href="/favicon.ico"><link rel="shortcut icon" href="/favicon_light.ico"><script>
      (function() {
        var theme = localStorage.getItem('theme');
        var resolved = 'system';
        if (theme === 'dark' || (theme !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          resolved = 'dark';
        } else {
          resolved = 'light';
        }
        document.documentElement.classList.add(resolved);
        document.documentElement.style.colorScheme = resolved;
      })();
    <\/script><script type="application/ld+json">${unescapeHTML(JSON.stringify({
		"@context": "https://schema.org",
		"@type": "Person",
		"name": "Juanma MC",
		"url": siteUrl,
		"image": ogImage,
		"jobTitle": "Fullstack Developer",
		"knowsAbout": [
			"Web Development",
			"AI",
			"Automation",
			"React",
			"Node.js",
			"TypeScript"
		],
		"sameAs": ["https://github.com/juanmamc", "https://linkedin.com/in/juanmamc"]
	}))}<\/script>${renderHead($$result)}</head><body class="noise-bg min-h-screen antialiased selection:bg-primary selection:text-primary-foreground"><a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg">${locale === "es" ? "Saltar al contenido principal" : "Skip to main content"}</a><div id="main-content">${renderSlot($$result, $$slots["default"])}</div>${renderComponent($$result, "SmoothScroll", null, {
		"client:only": "react",
		"client:component-hydration": "only",
		"client:component-path": "/Users/juanmamolinncortes/Documentos/portfolio-astro/src/components/SmoothScroll",
		"client:component-export": "default"
	})}</body></html>`;
}, "/Users/juanmamolinncortes/Documentos/portfolio-astro/src/layouts/BaseLayout.astro", void 0);
//#endregion
export { renderEntry as a, getEntry as i, t as n, getCollection as r, $$BaseLayout as t };
