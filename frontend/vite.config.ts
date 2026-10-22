import { defineConfig } from "vite";
import { resolve } from "node:path";
export default defineConfig({build:{lib:{entry:resolve(__dirname,"src/advanced-tv-remote-card.ts"),name:"AdvancedTvRemoteCard",formats:["es"],fileName:()=>"advanced-tv-remote-card.js"},outDir:"../custom_components/advanced_tv_remote/www",emptyOutDir:true}});
