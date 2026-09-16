import { getYoutubeEmbedUrl, isVideoFile } from "@/lib/utils";
import { Video } from "lucide-react";

export default function LessonVideoPlayer({ videoUrl }: { videoUrl: string | null }) {
  if (!videoUrl) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-slate-900 text-slate-500">
        <Video size={40} />
      </div>
    );
  }

  const embed = getYoutubeEmbedUrl(videoUrl);
  if (embed) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
        <iframe
          src={embed}
          title="Lesson video"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    );
  }

  if (isVideoFile(videoUrl)) {
    return (
      <video controls className="aspect-video w-full rounded-2xl bg-black" src={videoUrl}>
        Your browser does not support video playback.
      </video>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
      <iframe src={videoUrl} title="Lesson video" allowFullScreen className="h-full w-full" />
    </div>
  );
}
