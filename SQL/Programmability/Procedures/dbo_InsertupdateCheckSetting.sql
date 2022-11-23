SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[InsertupdateCheckSetting]
	
	@CheckSettingID int,
	@CompanyID int,
	@Style nvarchar(50),
	@Prefix nvarchar(10),
	@Length nvarchar(10),
	@StartNumber nvarchar(20),
	@EndNumber nvarchar(20),
	@Collated nvarchar(50),  
	@PrintZero bit,
	@Copies int,
	@TopMargin decimal(18, 2),
	@BottomMargin decimal(18, 2),
	@LeftMargin decimal(18, 2),
	@RightMargin decimal(18, 2),
	@Status nvarchar(20),
	@BankID int,
	@Prodid int ,
	@CreatedBy int,
	@SectionOne nvarchar(50),
	@SectionTwo nvarchar(50),
	@SectionThree nvarchar(50)
AS
BEGIN

	SET NOCOUNT ON;

    -- Insert statements for procedure here
	if not exists (select *From CheckSetting where BankID= @BankID )
	begin
	
	INSERT INTO [dbo].[CheckSetting]([CompanyID],[Style],[Prefix],[Length]
           ,[StartNumber],[EndNumber],[Collated],[PrintZero],[Copies]
           ,[TopMargin],[BottomMargin],[LeftMargin],[RightMargin],[Status]
           ,[BankID],[Prodid],[CreatedDate],[CreatedBy],SectionOne,SectionTwo,SectionThree)
     VALUES
           (@CompanyID,@Style,@Prefix,@Length,@StartNumber,@EndNumber,@Collated,@PrintZero,@Copies
		   ,@TopMargin,@BottomMargin,@LeftMargin,@RightMargin,@Status,@BankID,@Prodid,GETDATE(),@CreatedBy,
		   @SectionOne,@SectionTwo,@SectionThree)
		   set @CheckSettingID= SCOPE_IDENTITY()

		   select @CheckSettingID
		   end
		   else
		   begin
		   update CheckSetting set  [CompanyID]=@CompanyID,[Style]=@Style,[Prefix]=@Prefix,[Length]=@Length
           ,[StartNumber]=@StartNumber,[EndNumber]=@EndNumber,[Collated]=@Collated,[PrintZero]=@PrintZero,[Copies]=@Copies,[TopMargin]=@TopMargin,[BottomMargin]=@BottomMargin,[LeftMargin]=@LeftMargin,[RightMargin]=@RightMargin,[Status]=@Status,[Prodid]=@Prodid,[ModifiedDate]=GETDATE(),[ModifiedBy]=@CreatedBy,SectionOne=@SectionOne,SectionTwo=@SectionTwo,SectionThree=@SectionThree where BankID=@BankID
		   select @CheckSettingID
		   end
END



GO