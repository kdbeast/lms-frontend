import axios from "axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import ReactPlayer from "react-player";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useCreateLectureMutation } from "@/features/api/courseApi";

const MEDIA_API = `${import.meta.env.VITE_API_URL}/api/v1/media`;

const CreateDialog = ({ courseId }) => {
  const [isFree, setIsFree] = useState(false);
  const [lectureTitle, setLectureTitle] = useState("");
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideoInfo, setUploadedVideoInfo] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [createLecture, { data, isLoading }] = useCreateLectureMutation();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setMediaProgress(true);
      try {
        const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        });

        if (res.data.success) {
          setUploadedVideoInfo({
            videoUrl: res.data.data.secure_url || res.data.data.url,
            publicId: res.data.data.public_id,
          });
          toast.success(res.data.message);
        }
      } catch (error) {
        console.error("Upload failed", error);
        toast.error("Video upload failed");
      } finally {
        setMediaProgress(false);
      }
    }
  };

  useEffect(() => {
    if (data) {
      setLectureTitle(data.lectureTitle || "");
      setIsFree(data.isPreviewFree || false);
      if (data.videoUrl) {
        setUploadedVideoInfo({
          videoUrl: data.videoUrl,
        });
      }
    }
  }, [data]);

  const handleCreateLecture = async (e) => {
    if (e) e.preventDefault();
    const res = await createLecture({
      courseId,
      lectureTitle,
      isPreviewFree: isFree,
      videoInfo: uploadedVideoInfo,
    });

    if (res?.data?.lecture) {
      toast.success(res.data.message);
      setIsModalOpen(false);
      setLectureTitle("");
      setUploadedVideoInfo({});
    } else {
      toast.error(res.error?.data?.message || "Lecture creation failed");
    }
  };

  const renderButtonContent = (loading, text) =>
    loading ? (
      <>
        <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Please wait
      </>
    ) : (
      text
    );

  const disabled = !lectureTitle || !uploadedVideoInfo.videoUrl;

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <form>
        <DialogTrigger asChild onClick={() => setIsModalOpen(true)}>
          <Button>Add Lecture</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Lecture</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <Label className="mb-2">Title</Label>
              <Input
                type="text"
                value={lectureTitle}
                placeholder="Ex. Introduction to JavaScript"
                onChange={(e) => setLectureTitle(e.target.value)}
              />
            </div>
          </div>
          <div className="my-5">
            <Label className="mb-2">
              Video <span className="text-red-500">*</span>
            </Label>
            <Input
              type="file"
              accept="video/*"
              className="w-full mb-2"
              onChange={handleFileChange}
            />
          </div>
          <div className="flex items-center space-x-2 my-5">
            <Switch
              checked={isFree}
              id="airplane-mode"
              onCheckedChange={setIsFree}
            />
            <Label htmlFor="airplane-mode">Is this video FREE?</Label>
          </div>
          {mediaProgress && (
            <div className="my-4">
              <Progress value={uploadProgress} />
              <p>{uploadProgress}% uploaded</p>
            </div>
          )}
          {uploadedVideoInfo?.videoUrl && (
            <div className="w-full aspect-video mb-4">
              <ReactPlayer
                width="100%"
                height="100%"
                controls={true}
                src={uploadedVideoInfo.videoUrl}
                url={uploadedVideoInfo.videoUrl}
              />
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={disabled}
              onClick={handleCreateLecture}
            >
              {renderButtonContent(isLoading, "Save changes")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default CreateDialog;
