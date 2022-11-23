SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[InsertUpdatePCEnvelope]
	-- Add the parameters for the stored procedure here
	@PcEnvelopeID int,
	@Companyid int,
	@BatchNumber nvarchar(50),
	@CustodianId int ,
	@RecipientId int,
	@EnvelopeNumber nvarchar(50),
	@Description nvarchar(50),
	@AdvanceAmount decimal(18,2),
	@EnvelopeAmount decimal(18,2),
	@LineItemAmount decimal(18,2),
	@Difference decimal(18,2),
	@PostedDate date,
	@Status nvarchar(50),
	@CreatedBy int,
	@Prodid int,
	@PostedBy int,
	@ClosePeriodId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	--select * from PCEnvelope

	if(@PcEnvelopeID=0)
	begin
	INSERT INTO [dbo].[PCEnvelope]
           ([Companyid],[BatchNumber],[CustodianId],[RecipientId],[EnvelopeNumber],[Description],[AdvanceAmount]
           ,[EnvelopeAmount],[LineItemAmount],[Difference],[PostedDate],[Status],[CreatedDate],[CreatedBy]
           ,[Prodid],[PostedBy],ClosePeriodId,MirrorStatus )
		   values(
		   @Companyid ,	@BatchNumber ,@CustodianId  ,@RecipientId ,@EnvelopeNumber ,@Description ,@AdvanceAmount ,						   @EnvelopeAmount ,@LineItemAmount ,@Difference ,@PostedDate ,@Status ,GETDATE(),@CreatedBy ,@Prodid ,@PostedBy ,@ClosePeriodId,0
		   )

		   set @PcEnvelopeID=SCOPE_IDENTITY()
	end
	else
	begin
	update [dbo].[PCEnvelope] set 
	[Companyid]=@Companyid,[BatchNumber]=@BatchNumber,[CustodianId]=@CustodianId,[RecipientId]=@RecipientId,
	[EnvelopeNumber]=@EnvelopeNumber,[Description]=@Description,[AdvanceAmount]=@AdvanceAmount
    ,[EnvelopeAmount]=@EnvelopeAmount,[LineItemAmount]=@LineItemAmount,[Difference]=@Difference,[PostedDate]=@PostedDate
	,[Status]=@Status,[ModifiedBy]=@CreatedBy,[Prodid]=@Prodid,[PostedBy]=@PostedBy,Modifieddate=GETDATE(),ClosePeriodId=@ClosePeriodId

	where PcEnvelopeID=@PcEnvelopeID
	end

	select @PcEnvelopeID;
END
GO