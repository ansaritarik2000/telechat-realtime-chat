export default function convertEmailTemplateToHTML(emailTemplate) {
  return emailTemplate
    .map((section) => {
      if (section.type === "column") {
        return `
            <div style="display: flex; width: 100%">
              ${Object.values(section)
                .filter((item) => typeof item === "object" && item.type)
                .map((item) => {
                  if (item.type === "Button") {
                    return `
                      <div style="${inlineStyles(item.outerStyle)}">
                        <a href="${item.url}" style="${inlineStyles(
                      item.style
                    )}">
                          ${item.content}
                        </a>
                      </div>
                    `;
                  } else if (item.type === "SocialIcons") {
                    return `
                      <div style="${inlineStyles(item.outerStyle)}">
                        ${item.socialIcons
                          .map(
                            (icon) => `
                              <a href="${
                                icon.url
                              }" style="display: inline-block;">
                                <img src="${icon.icon}" style="${inlineStyles(
                              item.style
                            )}"/>
                              </a>
                            `
                          )
                          .join("")}
                      </div>
                    `;
                  }
                })
                .join("")}
            </div>
          `;
      }
      return "";
    })
    .join("");
}

function inlineStyles(styles) {
  return Object.entries(styles || {})
    .map(([key, value]) => `${camelToKebabCase(key)}: ${value};`)
    .join(" ");
}

function camelToKebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
