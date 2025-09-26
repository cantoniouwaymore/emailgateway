export function generateEmailHTML(templateData: any): string {
  const { variables } = templateData;
  
  return `
<div aria-label="${variables.email_title || 'Email'}" style="background-color:#f4f4f4" role="article" lang="und" dir="auto">
  <!-- Logo Section -->
  <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px">
    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%">
      <tbody>
        <tr>
          <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center">
            <div class="mj-column-per-100" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
              <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top" width="100%">
                <tbody>
                  <tr>
                    <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px">
                        <tbody>
                          <tr>
                            <td style="width:200px">
                              <img alt="Waymore" src="https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px" width="200" height="auto">
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Title Section -->
  <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px">
    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%">
      <tbody>
        <tr>
          <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center">
            <div class="mj-column-per-100" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
              <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top" width="100%">
                <tbody>
                  <tr>
                    <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word">
                      <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:24px;font-weight:bold;line-height:24px;text-align:center;color:#333333">${variables.email_title || 'Email Title'}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Content Section -->
  <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px">
    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%">
      <tbody>
        <tr>
          <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center">
            <div class="mj-column-per-100" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
              <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top" width="100%">
                <tbody>
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word">
                      <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;text-align:left;color:#555555">${variables.custom_content || variables.content?.en || 'Hello ' + (variables.user_firstname || 'User') + '!'}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  ${variables.facts && variables.facts.length > 0 ? `
  <!-- Facts Table Section -->
  <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px">
    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%">
      <tbody>
        <tr>
          <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center">
            <div class="mj-column-per-100" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
              <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top" width="100%">
                <tbody>
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word">
                      <table cellpadding="0" cellspacing="0" width="100%" border="0" style="color:#000000;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;line-height:22px;table-layout:auto;width:100%;border:none">
                        <tbody>
                          <tr style="border-bottom:1px solid #e0e0e0">
                            <td style="padding:10px 0;font-weight:bold;color:#cccccc">Label</td>
                            <td style="padding:10px 0;font-weight:bold;color:#cccccc">Value</td>
                          </tr>
                          ${variables.facts.map((fact: any) => `
                          <tr style="border-bottom:1px solid #e0e0e0">
                            <td style="padding:10px 0;color:#555555">${fact.label}</td>
                            <td style="padding:10px 0;color:#555555">${fact.value}</td>
                          </tr>
                          `).join('')}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  ` : ''}

  ${variables.cta_primary ? `
  <!-- CTA Button Section -->
  <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px">
    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%">
      <tbody>
        <tr>
          <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center">
            <div class="mj-column-per-100" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
              <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top" width="100%">
                <tbody>
                  <tr>
                    <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%">
                        <tbody>
                          <tr>
                            <td align="center" bgcolor="#007bff" role="presentation" style="border:none;border-radius:3px;background:#007bff" valign="middle">
                              <a href="${variables.cta_primary.url}" style="display:inline-block;background:#007bff;color:#ffffff;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:16px;font-weight:bold;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;border-radius:3px" target="_blank">${variables.cta_primary.label}</a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  ` : ''}

  ${variables.cta_secondary ? `
  <!-- Secondary CTA Button Section -->
  <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px">
    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%">
      <tbody>
        <tr>
          <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center">
            <div class="mj-column-per-100" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
              <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top" width="100%">
                <tbody>
                  <tr>
                    <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%">
                        <tbody>
                          <tr>
                            <td align="center" bgcolor="#6c757d" role="presentation" style="border:none;border-radius:3px;background:#6c757d" valign="middle">
                              <a href="${variables.cta_secondary.url}" style="display:inline-block;background:#6c757d;color:#ffffff;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:16px;font-weight:bold;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;border-radius:3px" target="_blank">${variables.cta_secondary.label}</a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  ` : ''}

  <!-- Footer Section -->
  <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px">
    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%">
      <tbody>
        <tr>
          <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center">
            <div class="mj-column-per-100" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
              <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top" width="100%">
                <tbody>
                  <tr>
                    <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word">
                      <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:12px;line-height:24px;text-align:center;color:#888888">This email was sent by ${variables.workspace_name || 'Company'}. If you have any questions, please contact <a href="mailto:${variables.support_email || 'support@example.com'}" style="color:#888888" target="_blank">${variables.support_email || 'support@example.com'}</a>.</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
  `;
}

export function generateEmailPreviewPage(example: any): string {
  const emailHtml = generateEmailHTML(example.json);
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${example.title} - Email Preview</title>
    <style>
        body { margin: 0; padding: 0; background: #f4f4f4; font-family: Arial, sans-serif; }
        .email-iframe { width: 100%; height: 100vh; border: none; }
    </style>
</head>
<body>
    <iframe src="data:text/html;charset=utf-8,${encodeURIComponent(emailHtml)}" class="email-iframe"></iframe>
</body>
</html>
  `;
}
