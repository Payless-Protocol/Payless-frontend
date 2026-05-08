import { NextRequest, NextResponse } from "next/server";
import { WaitlistEntry } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { name, email }: WaitlistEntry = await req.json();

    if (!name || !email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Name and valid email are required." },
        { status: 400 }
      );
    }

    const notionToken = process.env.NOTION_WAITLIST_TOKEN;
    const databaseId = process.env.NOTION_WAITLIST_DATABASE_ID;

    if (!notionToken || !databaseId) {
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://api.notion.com/v1/pages",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${notionToken}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
        body: JSON.stringify({
          parent: { database_id: databaseId },
          properties: {
            Name: {
              title: [{ text: { content: name } }],
            },
            Email: {
              email: email,
            },
            "Joined At": {
              date: { start: new Date().toISOString() },
            },
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      console.error("Notion error:", err);
      return NextResponse.json(
        { error: "Failed to save to waitlist." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Waitlist API error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
