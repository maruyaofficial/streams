import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY // Service Role Key
);

export default async function handler(req, res) {
  const { method, url } = req;

  if (url === "/api/streams" && method === "GET") {
    // Public safe fields
    const { data, error } = await supabase
      .from("streams")
      .select("id, name, type, created_at")
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (url === "/api/streams/full" && method === "GET") {
    // Admin endpoint
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.SUPABASE_KEY}`) {
      return res.status(401).send("Unauthorized");
    }

    const { data, error } = await supabase.from("streams").select("*");

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  return res.status(404).send("Not Found");
}
