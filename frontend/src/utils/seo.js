export const setMeta = (title, description) => {
  document.title = `${title} | E-Daka Premium`;
  
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', description || 'Premium technology products and electronics at E-Daka.');
};
