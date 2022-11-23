SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[UpdateSegmentAdmin]
	-- Add the parameters for the stored procedure here
	@SegmentCode nvarchar(50),
	@SegmentName nvarchar(50),
	@SegmentReportDescription nvarchar(50),
	@CodeLength nvarchar(50),
	@DetailFlag bit,
	@ProdId int,
	@CreatedBy int,
	@SegmentLevel int,
	@Classification nvarchar(50),
	@SubAccount1 nvarchar(50),
	@SubAccount2 nvarchar(50),
	@SubAccount3 nvarchar(50),
	@SubAccount4 nvarchar(50),
	@SubAccount5 nvarchar(50),
	@SubAccount6 nvarchar(50)


AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	if(@Classification='Ledger')
	begin
	insert into  SegmentLedger(SegmentCode,SegmentName,SegmentReportDescription,CodeLength,DetailFlag,ProdId,CreatedDate,
	CreatedBy,SegmentStatus,SegmentLevel,Classification
	
	
	)values(
	@SegmentCode,@SegmentName,@SegmentReportDescription,@CodeLength,@DetailFlag,@ProdId,GETDATE(),@CreatedBy,'Completed',@SegmentLevel
	,@Classification
	 )
	end
	else
	begin

    -- Insert statements for procedure here
	insert into  Segment(SegmentCode,SegmentName,SegmentReportDescription,CodeLength,DetailFlag,ProdId,CreatedDate,
	CreatedBy,SegmentStatus,SegmentLevel,Classification,
	
	SubAccount1,
	SubAccount2 ,
	SubAccount3 ,
	SubAccount4,
	SubAccount5 ,
	SubAccount6 
	)values(
	@SegmentCode,@SegmentName,@SegmentReportDescription,@CodeLength,@DetailFlag,@ProdId,GETDATE(),@CreatedBy,'Completed',@SegmentLevel
	,@Classification,
	@SubAccount1,
	@SubAccount2 ,
	@SubAccount3 ,
	@SubAccount4,
	@SubAccount5 ,
	@SubAccount6 )
	end


	DECLARE seg_Level CURSOR FOR 
	
SELECT Segmentid  from Segment  where ProdId=@ProdId
DECLARE @cnt INT = 1;
OPEN seg_Level
declare @segmentid INT
FETCH NEXT FROM seg_Level
INTO @segmentid

WHILE @@FETCH_STATUS = 0
BEGIN
  
update Segment  set SegmentLevel=@cnt  where SegmentId=@segmentid

SET @cnt = @cnt + 1;
FETCH NEXT FROM seg_Level 
INTO @segmentid
   end
    

    CLOSE seg_Level
    
DEALLOCATE seg_Level

Update segment Set SegmentStatus ='Completed' where SegmentLevel=1;

END






GO