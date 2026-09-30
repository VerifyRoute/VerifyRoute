// The one documented sample entry. It shows the shape of a registry record and
// is labelled SAMPLE wherever it appears: no endpoint has attested yet.

export const SAMPLE_ENDPOINT = {
  id: "sample-tdx-endpoint",
  name: "Sample TDX endpoint (open 70B model)",
  hardware: "Intel TDX confidential virtual machine",
  gpu: "Not covered by this sample",
  measurements: [
    { digest: "3c9e5a17b0d2…8e41f0a6", label: "latest", note: "compose hash of the pinned deployment" },
    { digest: "a61f02c4d9e3…17bb2c90", label: "previous", note: "earlier compose hash, replaced by a model image update" },
  ],
  history: [
    { when: "check window A", text: "checks passed, same measurement" },
    { when: "measurement change", text: "compose hash changed: model image updated" },
    { when: "check window B", text: "checks passed, same measurement" },
  ],
} as const;
