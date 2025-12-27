# Pasta de Imagens Públicas

Esta pasta contém arquivos estáticos que serão servidos diretamente pelo Next.js.

## Imagem de Background da Home

Para usar a imagem de fundo na home page:

1. **Converta o PDF para imagem:**
   - Abra o arquivo `Foto home.pdf` (na raiz do projeto)
   - Exporte como JPG, PNG ou WebP
   - Recomendado: JPG com qualidade 80-90% ou WebP para melhor compressão

2. **Salve a imagem:**
   - Nome do arquivo: `home.jpg` (ou `home.png`, `home.webp`)
   - Coloque nesta pasta: `public/home.jpg`

3. **Formatos suportados:**
   - `.jpg` / `.jpeg` (recomendado)
   - `.png`
   - `.webp` (melhor compressão)

4. **Tamanho recomendado:**
   - Largura: 1920px ou maior
   - Proporção: 16:9 ou similar
   - Peso: máximo 500KB (otimizado)

## Estrutura esperada:

```
public/
  ├── home.jpg (ou home.png, home.webp)
  └── README.md (este arquivo)
```

A imagem será automaticamente usada como background na seção hero da página inicial.

