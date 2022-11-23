SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[InsertupdateCOAManual] 
	-- Add the parameters for the stored procedure here
		@COACode nvarchar(100)
           ,@ParentCode  nvarchar(100)
           ,@Description nvarchar(100)
           ,@SS1 nvarchar(10)
           ,@SS2 nvarchar(20)
           ,@SS3 nvarchar(30)
           ,@SS4 nvarchar(40)
           ,@SS5 nvarchar(50)
           ,@SS6 nvarchar(60)
           ,@SS7 nvarchar(70)
           ,@SS8 nvarchar(80)
		   ,@AccountId int
		   ,@DetailLevel int 
           ,@ProdId int

AS
BEGIN
	declare @COAId int
	SET NOCOUNT ON;

    -- Insert statements for procedure here

	if exists (select * From COA where COACode=@COACode )
	begin
set @COAId= 0;
	end
	else
	begin
	
INSERT INTO [dbo].[COA]
           ([COACode]
           ,[ParentCode]
           ,[Description]
           ,[SS1]
           ,[SS2]
           ,[SS3]
           ,[SS4]
           ,[SS5]
           ,[SS6]
           ,[SS7]
           ,[SS8],
		   AccountId,
		   DetailLevel
           ,[ProdId])
     VALUES
           (@COACode
           ,@ParentCode
           ,@Description
           ,@SS1
           ,@SS2
           ,@SS3
           ,@SS4
           ,@SS5
           ,@SS6
           ,@SS7
           ,@SS8,
		   @AccountId,
		   @DetailLevel
           ,@ProdId)

		set @COAId= SCOPE_IDENTITY();
end

 select @COAId;
end


GO