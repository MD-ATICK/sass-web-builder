import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// Fake auth function - replace with your actual auth
const auth = () => ({ id: "fakeId" }); // Replace with real auth
export const ourFileRouter = {
	imageUploader: f({
		image: { maxFileSize: "4MB", maxFileCount: 1 },
	}).onUploadComplete(async ({ file }) => {
		return { url: file.url };
	}),

	// Multiple file upload
	multipleImages: f({
		image: { maxFileSize: "4MB", maxFileCount: 5 },
	})
		.middleware(async ({}) => {
			const user = auth();
			if (!user) throw new UploadThingError("Unauthorized");
			return { userId: user.id };
		})
		.onUploadComplete(async ({ metadata }) => {
			console.log("Multiple upload complete for userId:", metadata.userId);
			return { uploadedBy: metadata.userId };
		}),

	// PDF uploader
	pdfUploader: f({ pdf: { maxFileSize: "16MB", maxFileCount: 1 } })
		.middleware(async ({}) => {
			const user = auth();
			if (!user) throw new UploadThingError("Unauthorized");
			return { userId: user.id };
		})
		.onUploadComplete(async ({ metadata }) => {
			console.log("PDF uploaded by:", metadata.userId);
			return { uploadedBy: metadata.userId };
		}),

	// Any file type
	fileUploader: f({
		image: { maxFileSize: "4MB" },
		pdf: { maxFileSize: "16MB" },
		video: { maxFileSize: "64MB" },
	})
		.middleware(async ({}) => {
			const user = auth();
			if (!user) throw new UploadThingError("Unauthorized");
			return { userId: user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			console.log("File uploaded:", file.name);
			return { uploadedBy: metadata.userId };
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
