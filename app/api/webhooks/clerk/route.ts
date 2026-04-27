import { Webhook } from "svix";
import { headers } from "next/headers";
import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import createUser from "@/app/actions/user.actions";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, image_url, username, email_addresses } = evt.data;

    const newUser = await createUser({
      clerkId: id,
      useremail: email_addresses[0]?.email_address || "",
      avatar: image_url,
      username: username,
    });

    // Only set metadata on user.created, NOT on user.updated
    // This prevents the infinite loop: metadata update -> user.updated -> metadata update
    if (newUser) {
      const client = await clerkClient();
      await client.users.updateUserMetadata(id, {
        publicMetadata: {
          userId: (newUser as any)._id,
        },
      });
    }
  }

  if (eventType === "user.updated") {
    const { id, image_url, username, email_addresses } = evt.data;

    // Just sync the data, no metadata update to avoid triggering another webhook
    await createUser({
      clerkId: id,
      useremail: email_addresses[0]?.email_address || "",
      avatar: image_url,
      username: username,
    });
  }

  return new Response("", { status: 200 });
}
