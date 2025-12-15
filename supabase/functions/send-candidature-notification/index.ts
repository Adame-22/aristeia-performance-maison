import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CandidatureNotificationRequest {
  candidature_id: string;
}

const programmeLabels: Record<string, string> = {
  base: "BASE - Fondations & Santé",
  build: "BUILD - Force & Hypertrophie",
  peak: "PEAK - Performance & Compétition",
  indecis: "Indécis",
};

const experienceLabels: Record<string, string> = {
  debutant: "Débutant (moins d'1 an)",
  intermediaire: "Intermédiaire (1-3 ans)",
  avance: "Avancé (3-5 ans)",
  expert: "Expert (5+ ans)",
  competiteur: "Compétiteur actif",
};

// Helper function to escape HTML entities to prevent XSS
function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { candidature_id }: CandidatureNotificationRequest = await req.json();
    
    // Validate candidature_id format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!candidature_id || !uuidRegex.test(candidature_id)) {
      console.error("Invalid candidature_id format:", candidature_id);
      return new Response(
        JSON.stringify({ error: "Invalid candidature ID format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Supabase client with service role to bypass RLS
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch candidature from database to verify it exists
    const { data: candidature, error: dbError } = await supabase
      .from("candidatures")
      .select("*")
      .eq("id", candidature_id)
      .single();

    if (dbError || !candidature) {
      console.error("Candidature not found:", candidature_id, dbError);
      return new Response(
        JSON.stringify({ error: "Candidature not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Found candidature, sending notification emails for:", candidature.email);

    // Escape all user-provided content for HTML safety
    const safePrenom = escapeHtml(candidature.prenom);
    const safeNom = escapeHtml(candidature.nom);
    const safeEmail = escapeHtml(candidature.email);
    const safeTelephone = escapeHtml(candidature.telephone);
    const safeAge = escapeHtml(candidature.age);
    const safeObjectifs = escapeHtml(candidature.objectifs);
    const safeParcours = escapeHtml(candidature.parcours);
    const safeDisponibilites = escapeHtml(candidature.disponibilites);
    const safeMotivation = escapeHtml(candidature.motivation);

    const programmeLabel = programmeLabels[candidature.programme] || escapeHtml(candidature.programme);
    const experienceLabel = experienceLabels[candidature.experience] || escapeHtml(candidature.experience);

    // Send notification to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Aristeia <onboarding@resend.dev>",
      to: ["adame.gilot@gmail.com"],
      subject: `Nouvelle candidature - ${safePrenom} ${safeNom}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1F6FEB; border-bottom: 2px solid #1F6FEB; padding-bottom: 10px;">
            Nouvelle candidature Aristeia
          </h1>
          
          <h2 style="color: #333;">Informations personnelles</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Nom complet:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${safePrenom} ${safeNom}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${safeEmail}">${safeEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Téléphone:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${safeTelephone}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Âge:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${safeAge} ans</td>
            </tr>
          </table>

          <h2 style="color: #333;">Programme souhaité</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Programme:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${programmeLabel}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Expérience:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${experienceLabel}</td>
            </tr>
          </table>

          <h2 style="color: #333;">Objectifs</h2>
          <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${safeObjectifs}</p>

          <h2 style="color: #333;">Parcours sportif</h2>
          <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${safeParcours}</p>

          <h2 style="color: #333;">Disponibilités</h2>
          <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${safeDisponibilites}</p>

          <h2 style="color: #333;">Motivation</h2>
          <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${safeMotivation}</p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            Cette candidature a été soumise via le formulaire Aristeia Power House.
          </p>
        </div>
      `,
    });

    console.log("Admin notification sent:", adminEmailResponse);

    // Send confirmation to candidate
    const candidateEmailResponse = await resend.emails.send({
      from: "Aristeia <onboarding@resend.dev>",
      to: [candidature.email],
      subject: "Candidature reçue - Aristeia Power House",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1F6FEB;">Merci pour votre candidature, ${safePrenom} !</h1>
          
          <p>Nous avons bien reçu votre candidature pour rejoindre <strong>Aristeia Power House</strong>.</p>
          
          <p>Notre équipe va analyser votre profil avec attention et reviendra vers vous dans les plus brefs délais.</p>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Récapitulatif de votre candidature :</h3>
            <p><strong>Programme visé :</strong> ${programmeLabel}</p>
            <p><strong>Niveau d'expérience :</strong> ${experienceLabel}</p>
          </div>

          <p>À très bientôt,</p>
          <p><strong>L'équipe Aristeia</strong></p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            Cet email a été envoyé automatiquement suite à votre candidature sur aristeia.com
          </p>
        </div>
      `,
    });

    console.log("Candidate confirmation sent:", candidateEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        adminEmail: adminEmailResponse, 
        candidateEmail: candidateEmailResponse 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-candidature-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
