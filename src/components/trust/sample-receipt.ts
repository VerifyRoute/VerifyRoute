// A real Ed25519 signature made offline with a throwaway demo key. It proves the
// checker works; it is not a record of any routed call.
export const SAMPLE_RECEIPT = {
  "payload": {
    "version": 1,
    "id": "gen-sample-0001",
    "created_at": "2026-09-30T09:00:00Z",
    "model": "meta-llama/llama-3.3-70b-instruct",
    "provider": "sample-provider",
    "lane": "attested",
    "tokens": {
      "input": 142,
      "output": 88
    },
    "cost_usdg": "0.00004112",
    "request_sha256": "9b1f0c6a2e4d8b7f3c5a1e0d9f8b7a6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a",
    "response_sha256": "1e2d3c4b5a69788796a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3",
    "attestation_sha256": "4be0c1d2e3f405162738495a6b7c8d9eaf0b1c2d3e4f5a6b7c8d9e0f1a2b9d7f",
    "chain_id": 4663,
    "note": "Sample receipt signed by a demo key. Not a real call."
  },
  "signature": "scTKmJWE3tTwD2Sr4ckCOWS+zzONxA2QvfLgYLkwrMjmUx9O9GJoFT/0hcqy524RAcVq5EzUuw70J3t0aegxBg==",
  "public_key": "8868e049fe736969116b781752b19878614f86c9acd57e388fa11c579b7c8e02"
} as const;
