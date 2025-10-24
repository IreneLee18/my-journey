import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const PRISMA_DIR = join(process.cwd(), 'prisma');
const MODELS_DIR = join(PRISMA_DIR, 'models');
const SCHEMA_FILE = join(PRISMA_DIR, 'schema.prisma');

const mergeModels = () => {
  try {
    // Read the base schema file
    let schemaContent = readFileSync(SCHEMA_FILE, 'utf-8');

    // Remove any existing models from schema.prisma (everything after the merge comment)
    const mergeCommentIndex = schemaContent.indexOf('// Models will be automatically merged');
    if (mergeCommentIndex !== -1) {
      const lines = schemaContent.substring(0, mergeCommentIndex).split('\n');
      // Keep everything up to and including the merge comment line
      schemaContent = lines.join('\n') + '\n// Models will be automatically merged from prisma/models/*.prisma\n// Run: npm run prisma:merge\n';
    }

    // Read all .prisma files from models directory
    const modelFiles = readdirSync(MODELS_DIR)
      .filter((file) => {
        return file.endsWith('.prisma');
      })
      .sort();

    if (modelFiles.length === 0) {
      console.log('⚠️  No model files found in prisma/models/');
      return;
    }

    // Merge all model files
    const models = modelFiles.map((file) => {
      const modelPath = join(MODELS_DIR, file);
      const modelContent = readFileSync(modelPath, 'utf-8').trim();
      return `\n// From: ${file}\n${modelContent}`;
    });

    // Write the merged schema
    const finalSchema = schemaContent + models.join('\n\n') + '\n';
    writeFileSync(SCHEMA_FILE, finalSchema, 'utf-8');

    console.log('✅ Successfully merged Prisma models:');
    modelFiles.forEach((file) => {
      return console.log(`   - ${file}`);
    });
    console.log(`\n📝 Output: ${SCHEMA_FILE}`);
  } catch (error) {
    console.error('❌ Error merging models:', error);
    process.exit(1);
  }
};

mergeModels();

