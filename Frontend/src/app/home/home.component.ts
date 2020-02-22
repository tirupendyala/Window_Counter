import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  @ViewChild('myImage')
  myInputVariable: any;
  imgages:any;
  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  webCam = false;
  allowCameraSwitch = true;
  public message: string;
  public camera: any;
  public storeImage;
  public showWebcam: any;
  public cameraButton: any;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public webcamImage: WebcamImage = null;
  public errors: WebcamInitError[] = null;
  public img=null;
   
  count = 3;
  winCount = 0;
  err_msg = null;
  public Data: any;
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  naturalWidth: string;
  naturalHeight: string;
  constructor(private http: HttpClient) { }

  ngOnInit() {


  }

  fileProgress(fileInput: any) {
    this.fileData = fileInput.target.files[0];
    this.preview();


  }
  preview() {
    // Show Image preview after the selection or snapshot 
    this.err_msg = null;
    this.previewUrl = null;
    var mimeType = this.fileData.type;

    if (mimeType.match(/image\/*/) == null) {

      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {


      this.previewUrl = reader.result;
      let images = new Image();
          images.src = this.previewUrl;// below code shows the image dimensions (Height, Width)
            images.onload = () => {
              var x = [images.width, images.height]
              this.img = x;
              console.log(x)
             console.log("Image Size", images.width, images.height)
             alert('The Width is : ' + images.width +  ' and '+ 'The height is : ' + images.height);
            
             
            }
            
            
    }
  }
   onSubmit() {
    const formData = new FormData();
    formData.append('file', this.previewUrl);
    formData.append('imgDimensions',this.img);
    
    this.http.post('http://127.0.0.1:5000/uploadimage',formData)
   
      .subscribe((res: any) => { // below code pass the file data to the backend as stringURL
        this.err_msg = null;
        console.log(res);
        console.log('data passed to backend')
        var arr = res.Data.image.split(',')
        var str = arr[1].replace(/'/g, "");
        var resp = arr[0] + ',' + str.substring(1)
        this.previewUrl = resp;

        console.log(this.previewUrl);

       
        this.winCount = res.Data.count;
      
      }, (error) => {    //Error Handling
        //alert('Error !! server is down please try after sometime');
        this.err_msg = "Please upload a valid image"
        this.winCount = 0;
        window.scroll(0, 0);
      })
  }

   //onCamera function opens the webcam 
    onCamera() {
    this.myInputVariable.nativeElement.value = "";
    this.err_msg = null;
    this.webCam = true;
    this.previewUrl = null;;
  }
   //this closes webcam
  toggleWebcam() {
    this.webCam = false;
  }
  // Triggers the webcam to take a snapshot
  public triggerSnapshot(): void {
    this.trigger.next();
    this.cameraButton = false;

    let images = new Image(); // below code shows the image dimensions (Height, Width)
    images.src = this.previewUrl;
      images.onload = () => {
       console.log("Image Size", images.width, images.height)
       alert('The Width is : ' + images.width +  ' and ' + 'The height is : ' + images.height);
      }

    
  }
  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;

  }
  
  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    console.log(webcamImage)
    this.previewUrl = webcamImage.imageAsDataUrl;
    this.webCam = false;
  }
 
  // Triggers image capturing. When it fires, an image will be captured and output is shown
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public get nextWebcamObservable(): Observable<boolean | string> {


    var storeImage = this.nextWebcam.asObservable(); //this variable stores webcam image
    return this.nextWebcam.asObservable();

  }
}