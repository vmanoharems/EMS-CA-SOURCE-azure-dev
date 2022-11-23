SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[CheckSettingUpdate] -- CheckSettingUpdate 1,45,200,3,1
	-- Add the parameters for the stored procedure here
	@BankId int,
	@StartNumber nvarchar(20),
	@EndNumber nvarchar(20),
	@ProdId int,
	@CreatedBy int

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	declare @CompanyId int
	set @CompanyId= (select companyID From bankinfo where BankID=@BankId)
	if exists(select * From CheckSetting where BankID=@BankId)
	begin
	update CheckSetting set StartNumber=@StartNumber, EndNumber=@EndNumber,ModifiedBy=@CreatedBy,ModifiedDate=GETDATE() where BankID=@BankId
	end
	else
	begin
	INSERT INTO [dbo].[CheckSetting]([CompanyID],[Style],[Length]
           ,[StartNumber],[EndNumber],[Collated],[PrintZero],[Copies]
           ,[TopMargin],[BottomMargin],[LeftMargin],[RightMargin],[Status]
           ,[BankID],[Prodid],[CreatedDate],[CreatedBy])
     VALUES
           (@CompanyID,'1/3*1/3*1/3','4',@StartNumber,@EndNumber,'Reverse Collated','0','0'
		   ,'45.00','45.00','45.00','45.00','Active',@BankID,@Prodid,GETDATE(),@CreatedBy
		   )
	end
END



GO