#!/bin/bash

# Display script header
echo "========================================"
echo "   Running AI Hakeem Test Suite"
echo "========================================"

# Step 1: Run backend tests
echo -e "\n\n*** Running Backend Tests ***\n"
cd backend
npm test

# Save backend test result
BACKEND_RESULT=$?

# Step 2: Run frontend tests
echo -e "\n\n*** Running Frontend Tests ***\n"
cd ../frontend
npm test

# Save frontend test result
FRONTEND_RESULT=$?

# Step 3: Display test summary
echo -e "\n\n========================================"
echo "            Test Summary"
echo "========================================"
if [ $BACKEND_RESULT -eq 0 ]; then
    echo "Backend Tests: ✅ PASSED"
else
    echo "Backend Tests: ❌ FAILED"
fi

if [ $FRONTEND_RESULT -eq 0 ]; then
    echo "Frontend Tests: ✅ PASSED"
else
    echo "Frontend Tests: ❌ FAILED"
fi
echo "========================================"

# Exit with error if any test suite failed
if [ $BACKEND_RESULT -ne 0 ] || [ $FRONTEND_RESULT -ne 0 ]; then
    exit 1
fi

exit 0 