import {
    BNO055,
    // Enums:
    OpMode,
    DeviceAddress,
    PowerLevel,
} from 'bno055-imu-node';
import i2c from "i2c-bus";


export class IMU{
    imu:BNO055;
    inited=false;
    constructor(){
        this.initIMU()
    }

    async readData(){
        if (this.inited){
            const euler=await this.imu.getEuler();
            return {
                position:{azimuth:euler.h,altitude:180+euler.p},
                calibration:await this.imu.getCalibrationStatuses(),
                temperature: await this.imu.getTemperature()
            }
        }else{
            return {
                position:{azimuth:0,altitude:0},
                calibration: { sys: 0, gyro: 0, accel: 0, mag: 0 },
                temperature: 0
            }
        }
    }

    private async initIMU() {
        // Start the sensor
        // The begin method performs basic connection verification and resets the device
        this.imu = await BNO055.begin(
            DeviceAddress.B,    // Address enum: A = 0x28, B = 0x29
            OpMode.FullFusion,   // Operation mode enum
            3
        );
        await this.imu.resetSystem();
            await this.setOffsets();
        // Get the sensors' calibration status
        const calibration = await this.imu.getCalibrationStatuses();
        console.log(calibration);

        // Check to see if the device is fully calibrated
        const isCalibrated = await this.imu.isFullyCalibrated();

        // Get information about the device's operational systems
        const systemStatus = await this.imu.getSystemStatus();
        console.log(systemStatus);
        const systemError = await this.imu.getSystemError();
        const selfTestResults = await this.imu.getSelfTestResults();
        console.log(selfTestResults);
        const versions = await this.imu.getVersions();
        console.log(versions);
        // Get the device's orientation as a quaternion object { x, y, z, w }
        //const quat = await this.imu.getQuat();

        // Force the device to reset
        //await this.imu.resetSystem();

        // Set the device power level (Normal, Low, or Suspend)
        //await this.imu.setPowerLevel(PowerLevel.Normal);

        // Force the device to use an external clock source
        //await this.imu.useExternalClock();

        // Verify that the device is connected (will throw an error if not)
        await this.imu.verifyConnection();
        this.inited=true;
    }
    private async setOffsets(){
        const offsets={
            accelX: 65525,
            accelY: 15,
            accelZ: 1,
            magX: 228,
            magY: 62,
            magZ: 33,
            gyroX: 255,
            gyroY: 255,
            gyroZ: 1,
            accelRadius: 232,
            magRadius: 55
          };
          await this.imu.setMode(OpMode.Config);
        const i2cBus=await i2c.openPromisified(3);
        await i2cBus.writeWord(DeviceAddress.B,0x69,offsets.magRadius);
        await i2cBus.writeWord(DeviceAddress.B,0x67,offsets.accelRadius);
        await i2cBus.writeWord(DeviceAddress.B,0x65,offsets.gyroZ);
        await i2cBus.writeWord(DeviceAddress.B,0x63,offsets.gyroY);
        await i2cBus.writeWord(DeviceAddress.B,0x61,offsets.gyroX);
        await i2cBus.writeWord(DeviceAddress.B,0x5f,offsets.magZ);
        await i2cBus.writeWord(DeviceAddress.B,0x5d,offsets.magY);
        await i2cBus.writeWord(DeviceAddress.B,0x5b,offsets.magX);
        await i2cBus.writeWord(DeviceAddress.B,0x59,offsets.accelZ);
        await i2cBus.writeWord(DeviceAddress.B,0x57,offsets.accelY);
        await i2cBus.writeWord(DeviceAddress.B,0x55,offsets.accelX);
        await i2cBus.close()
        await this.imu.setMode(OpMode.FullFusion);
    }
}