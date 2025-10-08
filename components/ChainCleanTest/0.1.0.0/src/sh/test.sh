#!/bin/sh
echo "🧪 Running ChainCleanTest tests..."

# Smart build before testing
./src/sh/build.sh

# Create logs directory if it doesn't exist
mkdir -p test/logs

# Generate timestamp for log filename
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
LOG_FILE="test/logs/test-${TIMESTAMP}.log"

# Run tests with tee to split output (vitest has 180s timeout per test)
echo "⏱️  Running tests (180s timeout per test via vitest.config.ts)..."
echo "📝 Logging to: ${LOG_FILE}"
npm run vitest 2>&1 | tee "${LOG_FILE}"

# Check exit code from vitest (use PIPESTATUS to get npm run vitest exit code)
EXIT_CODE=${PIPESTATUS[0]}
if [ $EXIT_CODE -ne 0 ]; then
  echo "❌ Tests failed (see log: ${LOG_FILE})"
  exit $EXIT_CODE
else
  echo "✅ Tests passed (log: ${LOG_FILE})"
fi

