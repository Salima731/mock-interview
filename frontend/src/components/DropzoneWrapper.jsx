import { useDropzone } from 'react-dropzone';



const DropzoneWrapper = ({ setFieldValue, setPreviewImage }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': []
        },
        maxFiles: 1,
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            if (file) {
                setFieldValue('profilePhoto', file);
                setPreviewImage(URL.createObjectURL(file));
            }
        }
    });

    return (
        <div
            {...getRootProps()}
            style={{
                padding: '20px',
                border: '2px dashed #ccc',
                borderRadius: '10px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: isDragActive ? '#f7f7f7' : 'transparent'
            }}
        >
            <input {...getInputProps()} />
            {isDragActive ? (
                <p>Drop the image here ...</p>
            ) : (
                <p>Drag and drop a profile image here, or click to select</p>
            )}
        </div>
    );
};


export default DropzoneWrapper;