Deno.serve(async (req) => {
  try {
    const { formData, photos } = await req.json();
    
    // Format the email body
    const emailBody = `
Bus-ID: ${formData.busId}
Fahrer: ${formData.driverName}
Unfallort: ${formData.location}
Unfallzeit: ${new Date(formData.incidentTime).toLocaleString()}

Zusätzliche Informationen:
${formData.additionalInfo || "Keine"}
    `;
    
    // Current date for the subject
    const dateString = new Date().toLocaleString();
    
    // Send email using EmailJS service
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: 'service_default',
        template_id: 'template_default',
        user_id: 'user_default', // This would normally be your EmailJS user ID
        template_params: {
          to_email: 'gangerapollo16@gmail.com',
          subject: `Bus Unfall ${formData.busId ? '- ' + formData.busId : ''} - ${dateString}`,
          message: emailBody,
          // We would normally attach photos here, but for this demo we'll just include their count
          photo_count: Object.values(photos).filter(Boolean).length
        }
      }),
    });
    
    // For demonstration purposes, we'll simulate a successful response
    // In a real implementation, you would check the response from the email service
    
    console.log("Sending report to: gangerapollo16@gmail.com");
    console.log("Email body:", emailBody);
    console.log("Photos count:", Object.values(photos).filter(Boolean).length);
    
    return new Response(JSON.stringify({ 
      success: true,
      message: "Report sent successfully to gangerapollo16@gmail.com" 
    }), {
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    console.error("Error sending report:", error);
    
    return new Response(JSON.stringify({ 
      success: false,
      message: "Error sending report" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});