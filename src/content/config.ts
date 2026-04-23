import { defineCollection, z } from "astro:content";

const projects = defineCollection({
	type: "content",
	schema: z.object({
		project_title: z.string(),
		date: z.coerce.date(),
		featured: z.boolean().default(false),
		thumbnail: z.string(),
		tags: z.array(z.string()),
		client: z.string().nullable().optional(),
		introduction: z.string().optional(),
		phases: z
			.array(
				z.object({
					title: z.string(),
					sections: z.array(
						z.object({
							text: z.string().optional(),
							images: z
								.array(
									z.object({
										src: z.string(),
										alt: z.string().optional(),
									})
								)
								.optional(),
						})
					),
				})
			)
			.optional(),
	}),
});

export const collections = { projects };
