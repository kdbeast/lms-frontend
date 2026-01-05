import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  useEditLectureMutation,
  useGetLectureByIdQuery,
  useDeleteLectureMutation,
} from "../../../features/api/courseApi";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { useParams, useNavigate } from "react-router";

const MEDIA_API = "http://localhost:8080/api/v1/media";

const LectureTab = () => {
  const navigate = useNavigate();
  const { courseId, lectureId } = useParams();

  const { data: lectureByIdData } = useGetLectureByIdQuery(lectureId);

  const lecture = lectureByIdData?.lecture;

  const [isFree, setIsFree] = useState(false);
  const [btnDisable, setBtnDisable] = useState(true);
  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadedVideoInfo, setUploadedVideoInfo] = useState(null);

  const [
    deleteLecture,
    { isLoading: deleteLoading, isSuccess: deleteSuccess, data: deleteData },
  ] = useDeleteLectureMutation();

  const [editLecture, { isLoading, isSuccess, data, error }] =
    useEditLectureMutation();

  useEffect(() => {
    if (deleteData && deleteSuccess) {
      toast.success(deleteData.message || "Lecture Removed");
      navigate(`/admin/course/${courseId}/lecture`);
    }
  }, [deleteData, deleteSuccess, navigate, courseId]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Lecture updated");
    }
    if (error) {
      toast.error(error.message || "Lecture update failed");
    }
  }, [isSuccess, error, data]);

  useEffect(() => {
    if (lecture) {
      setLectureTitle(lecture.lectureTitle);
      setIsFree(lecture.isPreviewFree);
      setUploadedVideoInfo(lecture.videoInfo);
    }
  }, [lecture]);

  const handleRemoveLecture = async () => {
    await deleteLecture(lectureId);
  };

  const handleEditLecture = async () => {
    console.log(courseId, lectureId, lectureTitle, isFree, uploadedVideoInfo);
    await editLecture({
      courseId,
      lectureId,
      lectureTitle,
      isPreviewFree: isFree,
      videoInfo: uploadedVideoInfo,
    });
  };

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
          console.log(res);
          setUploadedVideoInfo({
            videoUrl: res.data.data.url,
            publicId: res.data.data.public_id,
          });
          setBtnDisable(false);
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

  const renderButtonContent = (loading, text) =>
    loading ? (
      <>
        <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Please wait
      </>
    ) : (
      text
    );

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription>
            Make changes and click save when done.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="destructive"
            disabled={deleteLoading}
            onClick={handleRemoveLecture}
          >
            {renderButtonContent(deleteLoading, "Remove Lecture")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <Label className="mb-2">Title</Label>
          <Input
            type="text"
            value={lectureTitle}
            placeholder="Ex. Introduction to JavaScript"
            onChange={(e) => setLectureTitle(e.target.value)}
          />
        </div>
        <div className="my-5">
          <Label className="mb-2">
            Video <span className="text-red-500">*</span>
          </Label>
          <Input
            type="file"
            accept="video/*"
            className="w-fit"
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

        <div className="mt-4">
          <Button
            onClick={handleEditLecture}
            disabled={isLoading || btnDisable}
          >
            {renderButtonContent(isLoading, "Update Lecture")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LectureTab;
