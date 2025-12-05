import { useState } from 'react';
import './PhotoUploader.css';
import { uploadPhoto } from './supabase';

interface UploadedPhoto {
  file: File;
  preview: string;
  targetName: string;
}

interface PhotoUploaderProps {
  onComplete: () => void;
}

const PhotoUploader = ({ onComplete }: PhotoUploaderProps) => {
  const [mainPhoto, setMainPhoto] = useState<UploadedPhoto | null>(null);
  const [bodyPhotos, setBodyPhotos] = useState<UploadedPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const validateImage = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        alert('请上传图片文件');
        resolve(false);
        return;
      }

      // Check file size (500KB limit recommended)
      if (file.size > 500 * 1024) {
        const confirmUpload = window.confirm(
          `图片 ${file.name} 大小为 ${(file.size / 1024).toFixed(0)}KB，超过建议的 500KB。\n继续上传可能影响流畅度，是否继续？`
        );
        if (!confirmUpload) {
          resolve(false);
          return;
        }
      }

      resolve(true);
    });
  };

  const handleMainPhotoChange = async (e: { target: { files: FileList | null } }) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!(await validateImage(file))) return;

    const preview = URL.createObjectURL(file);
    setMainPhoto({
      file,
      preview,
      targetName: 'top.jpg'
    });
  };

  const handleBodyPhotosChange = async (e: { target: { files: FileList | null } }) => {
    const files = Array.from(e.target.files || []);
    
    const validFiles: UploadedPhoto[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (await validateImage(file)) {
        const preview = URL.createObjectURL(file);
        validFiles.push({
          file,
          preview,
          targetName: `${bodyPhotos.length + validFiles.length + 1}.jpg`
        });
      }
    }

    setBodyPhotos([...bodyPhotos, ...validFiles]);
  };

  const handleDrag = (e: { preventDefault: () => void; stopPropagation: () => void; type: string }) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: { preventDefault: () => void; stopPropagation: () => void; dataTransfer: DataTransfer }, isMain: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    
    if (isMain) {
      const file = files[0];
      if (file && (await validateImage(file))) {
        const preview = URL.createObjectURL(file);
        setMainPhoto({ file, preview, targetName: 'top.jpg' });
      }
    } else {
      const validFiles: UploadedPhoto[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (await validateImage(file)) {
          const preview = URL.createObjectURL(file);
          validFiles.push({
            file,
            preview,
            targetName: `${bodyPhotos.length + validFiles.length + 1}.jpg`
          });
        }
      }
      setBodyPhotos([...bodyPhotos, ...validFiles]);
    }
  };

  const removeBodyPhoto = (index: number) => {
    const newPhotos = bodyPhotos.filter((_: UploadedPhoto, i: number) => i !== index);
    // Renumber remaining photos
    const renumbered = newPhotos.map((photo: UploadedPhoto, i: number) => ({
      ...photo,
      targetName: `${i + 1}.jpg`
    }));
    setBodyPhotos(renumbered);
  };

  const handleUpload = async () => {
    if (!mainPhoto) {
      alert('请先上传顶端封面图（top.jpg）');
      return;
    }

    setUploading(true);

    try {
      // Upload main photo to Supabase
      await uploadPhoto(mainPhoto.file, 'top.jpg');
      console.log('✅ Uploaded: top.jpg');

      // Upload body photos to Supabase
      for (let i = 0; i < bodyPhotos.length; i++) {
        const photo = bodyPhotos[i];
        await uploadPhoto(photo.file, `${i + 1}.jpg`);
        console.log(`✅ Uploaded: ${i + 1}.jpg`);
      }

      alert(`照片上传成功！\n\n已上传：\n- 1 张封面图 (top.jpg)\n- ${bodyPhotos.length} 张树身照片\n\n请刷新页面查看效果。`);
      
      // Reload the page to show new photos
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Upload error:', error);
      alert(`上传失败：${error instanceof Error ? error.message : '未知错误'}\n\n请确保：\n1. Supabase 存储桶 "christmas-tree-photos" 已创建\n2. 存储桶设置为公开访问\n3. 网络连接正常`);
    } finally {
      setUploading(false);
    }
  };

  const downloadInstructions = () => {
    if (!mainPhoto && bodyPhotos.length === 0) {
      alert('请先选择照片');
      return;
    }

    let instructions = '照片上传说明：\n\n';
    instructions += '请将以下照片手动保存到项目的 public/photos/ 文件夹中：\n\n';
    
    if (mainPhoto) {
      instructions += `1. 顶端封面图：将其重命名为 "top.jpg"\n`;
    }
    
    bodyPhotos.forEach((photo: UploadedPhoto, i: number) => {
      instructions += `${i + 2}. 树身照片 ${i + 1}：将其重命名为 "${i + 1}.jpg"\n`;
    });

    alert(instructions);
  };

  return (
    <div className="photo-uploader">
      <div className="uploader-header">
        <h2>🎄 圣诞树照片管理器</h2>
        <button onClick={onComplete} className="close-btn">✕</button>
      </div>

      <div className="uploader-content">
        {/* Main Photo Section */}
        <div className="upload-section">
          <h3>📸 顶端封面图 (top.jpg)</h3>
          <p className="hint">将显示在树顶的立体五角星上</p>
          
          <div
            className={`drop-zone ${dragActive ? 'drag-active' : ''} ${mainPhoto ? 'has-photo' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={(e: any) => handleDrop(e, true)}
          >
            {mainPhoto ? (
              <div className="photo-preview">
                <img src={mainPhoto.preview} alt="Main photo" />
                <button onClick={() => setMainPhoto(null)} className="remove-btn">删除</button>
              </div>
            ) : (
              <div className="drop-zone-content">
                <p>拖拽图片到此处或点击选择</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainPhotoChange}
                  className="file-input"
                  aria-label="Upload main photo"
                />
              </div>
            )}
          </div>
        </div>

        {/* Body Photos Section */}
        <div className="upload-section">
          <h3>🌲 树身照片 (1.jpg, 2.jpg, 3.jpg...)</h3>
          <p className="hint">建议使用正方形或 4:3 比例的图片，单张不超过 500KB</p>
          
          <div
            className={`drop-zone ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={(e: any) => handleDrop(e, false)}
          >
            <div className="drop-zone-content">
              <p>拖拽多张图片到此处或点击选择</p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleBodyPhotosChange}
                className="file-input"
                aria-label="Upload body photos"
              />
            </div>
          </div>

          {bodyPhotos.length > 0 && (
            <div className="photo-grid">
              {bodyPhotos.map((photo: UploadedPhoto, index: number) => (
                <div key={index} className="photo-item">
                  <img src={photo.preview} alt={`Photo ${index + 1}`} />
                  <div className="photo-info">
                    <span>{photo.targetName}</span>
                    <button onClick={() => removeBodyPhoto(index)} className="remove-btn-small">✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="uploader-actions">
          <div className="photo-count">
            总计: {mainPhoto ? 1 : 0} 个封面图 + {bodyPhotos.length} 个树身照片
          </div>
          
          <div className="button-group">
            <button
              onClick={downloadInstructions}
              className="btn btn-secondary"
              disabled={!mainPhoto && bodyPhotos.length === 0}
            >
              📋 查看手动保存说明
            </button>
            
            <button
              onClick={handleUpload}
              className="btn btn-primary"
              disabled={!mainPhoto || uploading}
            >
              {uploading ? '上传中...' : '上传照片'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoUploader;
