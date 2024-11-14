package com.sanhak_2

import android.content.Context
import android.widget.Toast
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.uimanager.ViewManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import android.content.res.AssetFileDescriptor
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import org.tensorflow.lite.Interpreter
import java.io.FileInputStream
import java.nio.MappedByteBuffer
import java.nio.channels.FileChannel
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.Base64
import com.facebook.react.bridge.*
import android.net.Uri
import java.nio.ByteBuffer
import java.nio.ByteOrder

class KitClassifierModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private var tflite: Interpreter? = null

    companion object {
        private const val MODEL_INPUT_SIZE = 224
        private const val PIXEL_SIZE = 3 // RGB 이미지
        private const val numLabels = 1  // 이진 분류를 위해 1로 설정
    }

    init {
        loadModel()
    }

    override fun getName(): String {
        return "KitClassifierModule"
    }

    private fun loadModel() {
        try {
            reactContext.assets.openFd("kit_success_model.tflite").use { fileDescriptor ->
                val inputStream = FileInputStream(fileDescriptor.fileDescriptor)
                val fileChannel = inputStream.channel
                val startOffset = fileDescriptor.startOffset
                val declaredLength = fileDescriptor.declaredLength
                val modelBuffer: MappedByteBuffer = fileChannel.map(FileChannel.MapMode.READ_ONLY, startOffset, declaredLength)
                tflite = Interpreter(modelBuffer)
            }
        } catch (e: Exception) {
            throw RuntimeException("Error loading model", e)
        }
    }

    @ReactMethod
    fun classifyKit(imageUri: String, promise: Promise) {
        try {
            val inputStream = reactContext.contentResolver.openInputStream(Uri.parse(imageUri))
            val bitmap = BitmapFactory.decodeStream(inputStream)
            inputStream?.close()

            if (bitmap == null) {
                promise.reject("ERROR_LOADING_IMAGE", "Could not decode the image.")
                return
            }

            val inputBuffer = convertBitmapToByteBuffer(bitmap)

            tflite?.let {
                val outputBuffer = Array(1) { FloatArray(numLabels) }
                it.run(inputBuffer, outputBuffer)

                // 결과를 반대로 처리하여 0.5 이하가 kit, 0.5 초과가 not kit으로 반환
                val isKit = outputBuffer[0][0] <= 0.5
                val results = Arguments.createMap()
                results.putBoolean("isKit", isKit)

                promise.resolve(results)
            } ?: run {
                promise.reject("ERROR_MODEL_NOT_LOADED", "TensorFlow Lite model is not loaded.")
            }
        } catch (e: Exception) {
            promise.reject("ERROR_PROCESSING_IMAGE", "Specific error: ${e.localizedMessage}")
        }
    }

    private fun convertBitmapToByteBuffer(bitmap: Bitmap): ByteBuffer {
        val resizedBitmap = Bitmap.createScaledBitmap(bitmap, MODEL_INPUT_SIZE, MODEL_INPUT_SIZE, true)

        val byteBuffer = ByteBuffer.allocateDirect(4 * MODEL_INPUT_SIZE * MODEL_INPUT_SIZE * PIXEL_SIZE)
        byteBuffer.order(ByteOrder.nativeOrder())

        val pixels = IntArray(MODEL_INPUT_SIZE * MODEL_INPUT_SIZE)
        resizedBitmap.getPixels(pixels, 0, MODEL_INPUT_SIZE, 0, 0, MODEL_INPUT_SIZE, MODEL_INPUT_SIZE)

        for (pixelValue in pixels) {
            val r = (pixelValue shr 16 and 0xFF) / 255.0f
            val g = (pixelValue shr 8 and 0xFF) / 255.0f
            val b = (pixelValue and 0xFF) / 255.0f
            byteBuffer.putFloat(r)
            byteBuffer.putFloat(g)
            byteBuffer.putFloat(b)
        }

        return byteBuffer
    }

    @ReactMethod
    fun showToast(message: String, duration: Int) {
        Toast.makeText(reactContext, message, duration).show()
    }
}

class KitClassifierPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(KitClassifierModule(reactContext) as NativeModule)
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}
