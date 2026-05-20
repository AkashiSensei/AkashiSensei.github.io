export type WorkbenchSoftware = {
  id: string
  name: string
  icon: string
  url?: string
}

export type WorkbenchGroup = {
  id: string
  featured?: boolean
  featuredOrder?: number
  software: WorkbenchSoftware[]
}

const iconBase = "/assets/workbench-icons"

export const workbenchGroups: WorkbenchGroup[] = [
  {
    id: "ai-assist",
    featured: true,
    featuredOrder: 1,
    software: [
      { id: "cursor", name: "Cursor", icon: `${iconBase}/cursor-512.webp` },
      { id: "codex", name: "Codex", icon: `${iconBase}/codex-512.webp` },
      { id: "chatgpt", name: "ChatGPT", icon: `${iconBase}/chatgpt-512.webp` },
      { id: "qclaw", name: "Qclaw", icon: `${iconBase}/qclaw-512.webp` },
      { id: "trae-cn", name: "Trae CN", icon: `${iconBase}/trae-cn-512.webp` },
    ],
  },
  {
    id: "dev-tools",
    software: [
      { id: "vscode", name: "Visual Studio Code", icon: `${iconBase}/vscode-512.webp` },
      { id: "intellij-idea", name: "IntelliJ IDEA", icon: `${iconBase}/intellij-idea-512.webp` },
      { id: "intellij-pycharm", name: "PyCharm", icon: `${iconBase}/intellij-pycharm-512.webp` },
      { id: "apifox", name: "Apifox", icon: `${iconBase}/apifox-512.webp` },
      { id: "xcode", name: "Xcode", icon: `${iconBase}/xcode-512.webp` },
    ],
  },
  {
    id: "office-productivity",
    software: [
      { id: "microsoft-word", name: "Microsoft Word", icon: `${iconBase}/microsoft-word-512.webp` },
      { id: "microsoft-excel", name: "Microsoft Excel", icon: `${iconBase}/microsoft-excel-512.webp` },
      { id: "microsoft-powerpoint", name: "Microsoft PowerPoint", icon: `${iconBase}/microsoft-powerpoint-512.webp` },
      { id: "microsoft-onedrive", name: "Microsoft OneDrive", icon: `${iconBase}/microsoft-onedrive-512.webp` },
      { id: "microsoft-onenote", name: "Microsoft OneNote", icon: `${iconBase}/microsoft-onenote-512.webp` },
      { id: "acrobat", name: "Adobe Acrobat", icon: `${iconBase}/acrobat-512.webp` },
      { id: "lark", name: "Lark", icon: `${iconBase}/lark-512.webp` },
      { id: "wps-office", name: "WPS Office", icon: `${iconBase}/wps-office-512.webp` },
    ],
  },
  {
    id: "virtual-remote",
    software: [
      { id: "docker", name: "Docker", icon: `${iconBase}/docker-512.webp` },
      { id: "parallels-desktop", name: "Parallels Desktop", icon: `${iconBase}/parallels-desktop-512.webp` },
      { id: "vmware", name: "VMware", icon: `${iconBase}/vmware-512.webp` },
      { id: "qemu", name: "QEMU", icon: `${iconBase}/qemu-512.webp` },
      { id: "termora", name: "Termora", icon: `${iconBase}/termora-512.webp` },
      { id: "windows-app", name: "Windows App", icon: `${iconBase}/windows-app-512.webp` },
    ],
  },
  {
    id: "knowledge-tools",
    featured: true,
    featuredOrder: 2,
    software: [
      { id: "evernote", name: "Evernote", icon: `${iconBase}/evernote-512.webp` },
      { id: "flowus", name: "FlowUS", icon: `${iconBase}/flowus-512.webp` },
      { id: "obsidian", name: "Obsidian", icon: `${iconBase}/obsidian-512.webp` },
      { id: "zotero", name: "Zotero", icon: `${iconBase}/zotero-512.webp` },
      { id: "mindnow", name: "MindNow", icon: `${iconBase}/mindnow-512.webp` },
      { id: "typora", name: "Typora", icon: `${iconBase}/typora-512.webp` },
    ],
  },
  {
    id: "analysis-tools",
    software: [
      { id: "nsight-compute", name: "Nsight Compute", icon: `${iconBase}/nsight-compute-512.webp` },
      { id: "nsight-systems", name: "Nsight Systems", icon: `${iconBase}/nsight-systems-512.webp` },
      { id: "wireshark", name: "Wireshark", icon: `${iconBase}/wireshark-512.webp` },
    ],
  },
  {
    id: "creative-adobe",
    featured: true,
    featuredOrder: 3,
    software: [
      { id: "adobe-creative-cloud", name: "Adobe Creative Cloud", icon: `${iconBase}/adobe-creative-cloud-512.webp` },
      { id: "adobe-ps", name: "Adobe Photoshop", icon: `${iconBase}/adobe-ps-512.webp` },
      { id: "adobe-ai", name: "Adobe Illustrator", icon: `${iconBase}/adobe-ai-512.webp` },
      { id: "adobe-pr", name: "Adobe Premiere Pro", icon: `${iconBase}/adobe-pr-512.webp` },
      { id: "adobe-ae", name: "Adobe After Effects", icon: `${iconBase}/adobe-ae-512.webp` },
      { id: "adobe-au", name: "Adobe Audition", icon: `${iconBase}/adobe-au-512.webp` },
      { id: "adobe-media-encoder", name: "Adobe Media Encoder", icon: `${iconBase}/adobe-media-encoder-512.webp` },
    ],
  },
  {
    id: "3d-software",
    software: [
      { id: "blender", name: "Blender", icon: `${iconBase}/blender-512.webp` },
      { id: "cinema-4d", name: "Cinema 4D", icon: `${iconBase}/cinema-4d-512.webp` },
      { id: "solidworks", name: "SOLIDWORKS", icon: `${iconBase}/solidworks-512.webp` },
    ],
  },
]

export const featuredWorkbenchGroups = [...workbenchGroups]
  .filter((group) => group.featured)
  .sort((left, right) => (left.featuredOrder ?? 0) - (right.featuredOrder ?? 0))
  .slice(0, 3)
